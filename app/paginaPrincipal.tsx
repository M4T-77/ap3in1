import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from './constants/Colors';

const { width, height } = Dimensions.get('window');

// --- Interfaces and Types ---
interface Profile {
  id: number;
  name: string;
  age: number;
  photo: string;
  bio: string;
}

type Screen = 'fotos' | 'matches' | 'perfil';

// --- Hardcoded Data ---
const profilesData: Profile[] = [
    {
      id: 1,
      name: 'María',
      age: 24,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Amante del café y los viajes ☕✈️',
    },
    {
      id: 2,
      name: 'Ana',
      age: 26,
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Yoga, naturaleza y buena música 🧘‍♀️',
    },
    {
      id: 3,
      name: 'Laura',
      age: 23,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      bio: 'Artista digital y amante de los gatos 🎨',
    },
    {
      id: 4,
      name: 'Sofía',
      age: 28,
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      bio: 'Aventurera y fotógrafa aficionada 🏞️📸',
    },
    {
      id: 5,
      name: 'Isabella',
      age: 25,
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      bio: 'Cinéfila y repostera en mis tiempos libres 🎬🍰',
    },
    {
      id: 6,
      name: 'Valentina',
      age: 27,
      photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
      bio: 'Lectora apasionada y voluntaria en refugios de animales 📚❤️',
    },
];

// --- Header Component ---
const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.logoText}>
      <Text style={styles.logoBold}>love</Text>
      <Text style={styles.logoApp}>App</Text>
    </Text>
  </View>
);

// --- FotosScreen (Swiping) Component ---
const FotosScreen = () => {
  const [index, setIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          Animated.timing(pan, { toValue: { x: width + 100, y: gesture.dy }, useNativeDriver: false, duration: 200 }).start(() => {
            setIndex((i) => i + 1);
            pan.setValue({ x: 0, y: 0 });
          });
        } else if (gesture.dx < -120) {
          Animated.timing(pan, { toValue: { x: -width - 100, y: gesture.dy }, useNativeDriver: false, duration: 200 }).start(() => {
            setIndex((i) => i + 1);
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 4, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const rotate = pan.x.interpolate({ inputRange: [-width / 2, 0, width / 2], outputRange: ['-10deg', '0deg', '10deg'], extrapolate: 'clamp' });

  const glowColor = pan.x.interpolate({
    inputRange: [-width / 4, 0, width / 4],
    outputRange: [Colors.error, '#000', Colors.success],
    extrapolate: 'clamp',
  });

  const glowRadius = pan.x.interpolate({
    inputRange: [-width / 4, 0, width / 4],
    outputRange: [30, 5, 30],
    extrapolate: 'clamp',
  });

  const glowOpacity = pan.x.interpolate({
    inputRange: [-width / 4, 0, width / 4],
    outputRange: [1, 0.4, 1],
    extrapolate: 'clamp',
  });
  
  const elevation = pan.x.interpolate({
    inputRange: [-width / 4, 0, width / 4],
    outputRange: [30, 10, 30],
    extrapolate: 'clamp',
  });

  const animatedCardStyle = {
    shadowColor: glowColor,
    shadowOpacity: glowOpacity,
    shadowRadius: glowRadius,
    elevation: elevation,
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
  };

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? width + 100 : -width - 100;
    Animated.timing(pan, { toValue: { x, y: 0 }, duration: 400, useNativeDriver: false }).start(() => {
      setIndex((i) => i + 1);
      pan.setValue({ x: 0, y: 0 });
    });
  };

  const renderCard = () => {
    if (index >= profilesData.length) {
      return (
        <View style={styles.center}>
          <Ionicons name="heart" size={80} color={Colors.brown} />
          <Text style={styles.endText}>No hay más perfiles</Text>
        </View>
      );
    }
    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.card, animatedCardStyle]}
      >
        <Image source={{ uri: profilesData[index].photo }} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.name}>{profilesData[index].name}, {profilesData[index].age}</Text>
          <Text style={styles.bio}>{profilesData[index].bio}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.fotosContainer}>
      <View style={styles.deckContainer}>{renderCard()}</View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => forceSwipe('left')}>
          <Ionicons name="close-circle" size={64} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => forceSwipe('right')}>
          <Ionicons name="heart-circle" size={72} color={Colors.brown} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Other Screen Components ---
const MatchesScreen = () => (
  <View style={styles.center}>
    <Text style={styles.placeholderText}>Aquí se mostrarán tus matches</Text>
  </View>
);

const PerfilScreen = () => (
  <View style={styles.center}>
    <Text style={styles.placeholderText}>Aquí se mostrará tu perfil</Text>
  </View>
);

// --- Navigation Bar ---
const BarraNavegacion = ({ active, setActive }: { active: Screen; setActive: (s: Screen) => void }) => (
  <View style={styles.navBar}>
    <TouchableOpacity style={styles.navButton} onPress={() => setActive('fotos')}>
      <Ionicons name="images" size={24} color={active === 'fotos' ? Colors.brown : Colors.lightGray} />
      <Text style={[styles.navText, { color: active === 'fotos' ? Colors.brown : Colors.lightGray }]}>Descubrir</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => setActive('matches')}>
      <Ionicons name="heart" size={24} color={active === 'matches' ? Colors.brown : Colors.lightGray} />
      <Text style={[styles.navText, { color: active === 'matches' ? Colors.brown : Colors.lightGray }]}>Matches</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => setActive('perfil')}>
      <Ionicons name="person" size={24} color={active === 'perfil' ? Colors.brown : Colors.lightGray} />
      <Text style={[styles.navText, { color: active === 'perfil' ? Colors.brown : Colors.lightGray }]}>Perfil</Text>
    </TouchableOpacity>
  </View>
);

// --- Main Page Component ---
export default function PaginaPrincipal() {
  const [activeScreen, setActiveScreen] = useState<Screen>('fotos');

  const renderContent = () => {
    switch (activeScreen) {
      case 'fotos': return <FotosScreen />;
      case 'matches': return <MatchesScreen />;
      case 'perfil': return <PerfilScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>{renderContent()}</View>
      <BarraNavegacion active={activeScreen} setActive={setActiveScreen} />
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.offWhite },
  headerContainer: {
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.offWhite,
  },
  logoText: {
    fontSize: 28,
  },
  logoBold: {
    fontWeight: 'bold',
    color: Colors.black,
  },
  logoApp: {
    color: Colors.brown,
  },
  container: { flex: 1 },
  fotosContainer: { flex: 1 },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.offWhite,
  },
  placeholderText: { 
    fontSize: 18, 
    color: Colors.lightGray, 
    textAlign: 'center',
    padding: 20,
  },
  card: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 24,
    backgroundColor: '#fff',
    position: 'absolute',
    shadowOffset: { width: 0, height: 5 },
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  name: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  bio: { color: '#eee', fontSize: 16, marginTop: 6 },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    paddingVertical: 15,
    backgroundColor: Colors.offWhite,
  },
  endText: { fontSize: 24, marginTop: 16, fontWeight: 'bold', color: Colors.black },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.lightGray, backgroundColor: Colors.offWhite },
  navButton: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 4 },
});
