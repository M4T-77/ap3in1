import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSwipeLogic } from '@/lib/ui/useSwipeLogic';

const { width, height } = Dimensions.get('window');

interface PhotoCardProps {
  photoUri: string;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photoUri,
  onSwipeRight,
  onSwipeLeft,
}) => {
  const { panGesture, animatedStyle } = useSwipeLogic({
    onSwipeRight,
    onSwipeLeft,
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Image source={{ uri: photoUri }} style={styles.image} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});