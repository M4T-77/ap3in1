import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

const Colors = {
  offWhite: '#FAF9F6',
  brown: '#8B4513',
  black: '#000000',
  lightGray: '#D3D3D3',
};

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.logoText}>
      <Text style={styles.logoBold}>Camera</Text>
      <Text style={styles.logoApp}>App</Text>
    </Text>
  </View>
);

export default function PantallaLogin() {
  const router = useRouter();

  const irACamera = () => {
    router.push('/camera');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={irACamera}>
          <Text style={styles.buttonText}>Ir a Cámara</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: Colors.brown,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.offWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
});