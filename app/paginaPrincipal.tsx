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
  ScrollView,
  TextInput,
  FlatList,
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

interface UserProfile {
  id: number;
  name: string;
  age: number;
  gender: string;
  photo: string;
  bio: string;
  hobbies: string[];
}

type Screen = 'descubrir' | 'matches' | 'perfil';

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

const userProfileData: UserProfile = {
  id: 0,
  name: 'Carlos',
  age: 28,
  gender: 'Masculino',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  bio: 'Desarrollador de software y entusiasta de la tecnología. En mi tiempo libre, me gusta explorar nuevas rutas de senderismo y experimentar en la cocina.',
  hobbies: ['Programar', 'Senderismo', 'Cocinar', 'Cine', 'Leer'],
};


// --- Header Component ---
const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.logoText}>
      <Text style={styles.logoBold}>love</Text>
      <Text style={styles.logoApp}>App</Text>
    </Text>
  </View>
);

// --- DescubrirScreen (Swiping) Component ---
const DescubrirScreen = ({ onMatch }: { onMatch: (profile: Profile) => void }) => {
  const [index, setIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const resetCard = () => {
      pan.setValue({ x: 0, y: 0 });
      setIndex((i) => i + 1);
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          Animated.timing(pan, { toValue: { x: width + 100, y: gesture.dy }, useNativeDriver: false, duration: 200 }).start(() => {
            onMatch(profilesData[index]);
            resetCard();
          });
        } else if (gesture.dx < -120) {
          Animated.timing(pan, { toValue: { x: -width - 100, y: gesture.dy }, useNativeDriver: false, duration: 200 }).start(() => {
            resetCard();
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

  const animatedCardStyle = {
    shadowColor: glowColor,
    shadowOpacity: pan.x.interpolate({ inputRange: [-width / 4, 0, width / 4], outputRange: [1, 0.4, 1], extrapolate: 'clamp' }),
    shadowRadius: pan.x.interpolate({ inputRange: [-width / 4, 0, width / 4], outputRange: [30, 5, 30], extrapolate: 'clamp' }),
    elevation: pan.x.interpolate({ inputRange: [-width / 4, 0, width / 4], outputRange: [30, 10, 30], extrapolate: 'clamp' }),
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
  };

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? width + 100 : -width - 100;
    Animated.timing(pan, { toValue: { x, y: 0 }, duration: 400, useNativeDriver: false }).start(() => {
      if (direction === 'right') {
        onMatch(profilesData[index]);
      }
      resetCard();
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
      {index < profilesData.length && (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => forceSwipe('left')}>
            <Ionicons name="close-circle" size={64} color={Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => forceSwipe('right')}>
            <Ionicons name="heart-circle" size={72} color={Colors.brown} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- Other Screen Components ---
const MatchesScreen = ({ matches }: { matches: Profile[] }) => {
  if (matches.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.placeholderText}>Aquí se mostrarán tus matches</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.matchItem}>
          <Image source={{ uri: item.photo }} style={styles.matchImage} />
          <View style={styles.matchInfo}>
            <Text style={styles.matchName}>{item.name}, {item.age}</Text>
            <Text style={styles.matchBio}>{item.bio}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.matchesContainer}
    />
  );
};

const PerfilScreen = () => {
  const [user, setUser] = useState<UserProfile>(userProfileData);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    Object.assign(userProfileData, user);
    setIsEditing(false);
  };
  
  const handleHobbyChange = (text: string, index: number) => {
    const newHobbies = [...user.hobbies];
    newHobbies[index] = text;
    setUser({ ...user, hobbies: newHobbies });
  };


  return (
    <ScrollView style={styles.profileContainer}>
       <View style={styles.profileHeader}>
         <Image source={{ uri: user.photo }} style={styles.profileImage} />
         <TouchableOpacity style={styles.editButton} onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
           <Text style={styles.editButtonText}>{isEditing ? 'Guardar' : 'Editar'}</Text>
         </TouchableOpacity>
       </View>
      
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Datos Personales</Text>
        {isEditing ? (
          <>
            <TextInput style={styles.input} value={user.name} onChangeText={(text) => setUser({...user, name: text})} placeholder="Nombre" />
            <TextInput style={styles.input} value={user.age.toString()} onChangeText={(text) => setUser({...user, age: parseInt(text) || 0})} placeholder="Edad" keyboardType="numeric" />
            <TextInput style={styles.input} value={user.gender} onChangeText={(text) => setUser({...user, gender: text})} placeholder="Género" />
          </>
        ) : (
          <>
            <Text style={styles.profileName}>{user.name}, {user.age}</Text>
            <Text style={styles.profileGender}>{user.gender}</Text>
          </>
        )}
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Sobre mí</Text>
        {isEditing ? (
           <TextInput style={[styles.input, styles.bioInput]} value={user.bio} onChangeText={(text) => setUser({...user, bio: text})} placeholder="Biografía" multiline />
        ) : (
           <Text style={styles.bioText}>{user.bio}</Text>
        )}
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Hobbies</Text>
        <View style={styles.hobbiesContainer}>
          {isEditing ? (
            user.hobbies.map((hobby, index) => (
              <TextInput key={index} style={styles.hobbyInput} value={hobby} onChangeText={(text) => handleHobbyChange(text, index)} />
            ))
          ) : (
            user.hobbies.map((hobby, index) => (
              <View key={index} style={styles.hobbyChip}>
                <Text style={styles.hobbyText}>{hobby}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};


// --- Navigation Bar ---
const BarraNavegacion = ({ active, setActive }: { active: Screen; setActive: (s: Screen) => void }) => (
  <View style={styles.navBar}>
    <TouchableOpacity style={styles.navButton} onPress={() => setActive('descubrir')}>
      <Ionicons name="images" size={24} color={active === 'descubrir' ? Colors.brown : Colors.lightGray} />
      <Text style={[styles.navText, { color: active === 'descubrir' ? Colors.brown : Colors.lightGray }]}>Descubrir</Text>
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
  const [activeScreen, setActiveScreen] = useState<Screen>('descubrir');
  const [matches, setMatches] = useState<Profile[]>([]);

  const handleMatch = (profile: Profile) => {
    if (!matches.some(m => m.id === profile.id)) {
      setMatches(prevMatches => [...prevMatches, profile]);
    }
  };

  const renderContent = () => {
    switch (activeScreen) {
      case 'descubrir': return <DescubrirScreen onMatch={handleMatch} />;
      case 'matches': return <MatchesScreen matches={matches} />;
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
  logoText: { fontSize: 28, },
  logoBold: { fontWeight: 'bold', color: Colors.black, },
  logoApp: { color: Colors.brown, },
  container: { flex: 1 },
  fotosContainer: { flex: 1 },
  deckContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.offWhite, },
  placeholderText: { fontSize: 18, color: Colors.lightGray, textAlign: 'center', padding: 20, },
  card: { width: width * 0.9, height: height * 0.6, borderRadius: 24, backgroundColor: '#fff', position: 'absolute', shadowOffset: { width: 0, height: 5 }, },
  image: { width: '100%', height: '100%', borderRadius: 24, },
  overlay: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, },
  name: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  bio: { color: '#eee', fontSize: 16, marginTop: 6 },
  buttons: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30, paddingVertical: 15, backgroundColor: Colors.offWhite, },
  endText: { fontSize: 24, marginTop: 16, fontWeight: 'bold', color: Colors.black },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.lightGray, backgroundColor: Colors.offWhite },
  navButton: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 4 },

  // Matches Screen Styles
  matchesContainer: {
    padding: 10,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  matchBio: {
    fontSize: 14,
    color: Colors.lightGray,
    marginTop: 4,
  },

  // Profile Screen Styles
  profileContainer: { flex: 1, backgroundColor: Colors.offWhite, },
  profileHeader: { alignItems: 'center', padding: 20, position: 'relative'},
  profileImage: { width: 150, height: 150, borderRadius: 75, borderWidth: 3, borderColor: Colors.brown, },
  profileName: { fontSize: 26, fontWeight: 'bold', color: Colors.black, marginTop: 10 },
  profileGender: { fontSize: 16, color: Colors.lightGray, marginTop: 4, },
  profileSection: { paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1, borderTopColor: Colors.lightGray, },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.black, marginBottom: 10, },
  bioText: { fontSize: 16, color: Colors.black, lineHeight: 24, },
  hobbiesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, },
  hobbyChip: { backgroundColor: Colors.brown, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, },
  hobbyText: { color: '#fff', fontSize: 14, },
  editButton: { position: 'absolute', top: 20, right: 20, backgroundColor: Colors.brown, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, },
  editButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  hobbyInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    color: Colors.black,
  }
});
