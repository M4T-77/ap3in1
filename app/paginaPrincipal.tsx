
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from './constants/Colors';

const { width } = Dimensions.get('window');

interface Profile {
  id: number;
  name: string;
  age: number;
  photo: string;
  bio: string;
}

type Screen = 'fotos' | 'matches' | 'perfil';

// Componente para la pantalla de perfiles deslizables
const FotosScreen = () => {
  const [profiles] = useState<Profile[]>([
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
  ]);

  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      setDx(gesture.dx);
    },
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) > 120) {
        setIndex((i) => i + 1);
      } else {
        setDx(0);
      }
    },
  });

  if (index >= profiles.length) {
    return (
      <View style={styles.center}>
        <Ionicons name="heart" size={80} color={Colors.brown} />
        <Text style={styles.endText}>No hay más perfiles</Text>
      </View>
    );
  }

  const profile = profiles[index];

  return (
    <View style={styles.fotosContainer}>
      <View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          { transform: [{ translateX: dx }, { rotate: `${dx * 0.05}deg` }] },
        ]}
      >
        <Image source={{ uri: profile.photo }} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>
        {dx > 50 && <Text style={[styles.badge, styles.like]}>LIKE</Text>}
        {dx < -50 && <Text style={[styles.badge, styles.nope]}>NOPE</Text>}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => setIndex(index + 1)}>
          <Ionicons name="close-circle" size={64} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIndex(index + 1)}>
          <Ionicons name="heart-circle" size={72} color={Colors.brown} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Componente para la pantalla de Matches
const MatchesScreen = () => (
  <View style={styles.center}>
    <Text style={styles.screenTitle}>Matches</Text>
  </View>
);

// Componente para la pantalla de Perfil
const PerfilScreen = () => (
  <View style={styles.center}>
    <Text style={styles.screenTitle}>Perfil</Text>
  </View>
);

// Componente de la barra de navegación inferior
const BarraNavegacion = ({ active, setActive }: { active: Screen; setActive: (s: Screen) => void }) => (
  <View style={styles.navBar}>
    <TouchableOpacity style={styles.navButton} onPress={() => setActive('fotos')}>
      <Ionicons name="images" size={24} color={active === 'fotos' ? Colors.brown : Colors.lightGray} />
      <Text style={[styles.navText, { color: active === 'fotos' ? Colors.brown : Colors.lightGray }]}>
        Fotos
      </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => setActive('matches')}>
      <Ionicons name="heart" size={24} color={active === 'matches' ? Colors.brown : Colors.lightGray} />
      <Text style={[styles.navText, { color: active === 'matches' ? Colors.brown : Colors.lightGray }]}>
        Matches
      </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => setActive('perfil')}>
      <Ionicons name="person" size={24} color={active === 'perfil' ? Colors.brown : Colors.lightGray} />
      <Text style={[styles.navText, { color: active === 'perfil' ? Colors.brown : Colors.lightGray }]}>
        Perfil
      </Text>
    </TouchableOpacity>
  </View>
);

// Componente principal de la página
export default function PaginaPrincipal() {
  const [activeScreen, setActiveScreen] = useState<Screen>('fotos');

  const renderContent = () => {
    switch (activeScreen) {
      case 'fotos':
        return <FotosScreen />;
      case 'matches':
        return <MatchesScreen />;
      case 'perfil':
        return <PerfilScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderContent()}
      </View>
      <BarraNavegacion active={activeScreen} setActive={setActiveScreen} />
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  container: {
    flex: 1,
  },
  fotosContainer: {
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
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  card: {
    width: width * 0.9,
    height: 500,
    borderRadius: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(13, 13, 13, 0.6)',
  },
  name: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  bio: {
    color: '#eee',
    marginTop: 6,
  },
  badge: {
    position: 'absolute',
    top: 30,
    padding: 10,
    fontSize: 32,
    fontWeight: 'bold',
    borderWidth: 4,
  },
  like: {
    left: 20,
    color: Colors.brown,
    borderColor: Colors.brown,
    transform: [{ rotate: '-20deg' }],
  },
  nope: {
    right: 20,
    color: Colors.black,
    borderColor: Colors.black,
    transform: [{ rotate: '20deg' }],
  },
  buttons: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 30,
  },
  endText: {
    fontSize: 24,
    marginTop: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.offWhite,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
});
