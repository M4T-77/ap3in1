import { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SWIPE_THRESHOLD = 100;
const ROTATION_FACTOR = 0.1;

interface SwipeLogicProps {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
}

export const useSwipeLogic = ({ onSwipeRight, onSwipeLeft }: SwipeLogicProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const resetPosition = () => {
    'worklet';
    translateX.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
  };

  const animateOut = (direction: 'left' | 'right', callback?: () => void) => {
    'worklet';
    const targetX = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    
    translateX.value = withTiming(
      targetX,
      { duration: 300 },
      (finished) => {
        if (finished && callback) {
          runOnJS(callback)();
        }
      }
    );
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        animateOut('right', onSwipeRight);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        animateOut('left', onSwipeLeft);
      } else {
        resetPosition();
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = translateX.value * ROTATION_FACTOR;

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  return {
    panGesture,
    animatedStyle,
    resetPosition,
  };
};