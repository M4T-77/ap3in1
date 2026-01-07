import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const initialState = { email: '', password: '' };

// Colores consistentes
const Colors = {
  offWhite: '#FAF9F6',
  brown: '#8B4513',
  black: '#000000',
  lightGray: '#D3D3D3',
  error: '#FF0000',
  lightBrown: '#A0826D',
  subtleGray: '#F0EBE3',
  textSubtle: '#5C3D2E',
};

// Componente del logo
const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.logoText}>
      <Text style={styles.logoBold}>love</Text>
      <Text style={styles.logoApp}>App</Text>
    </Text>
  </View>
);

// Función de validación
const validateLogin = ({ email, password }: { email: string; password: string }) => {
  const errors: { email?: string; password?: string } = {};
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'El correo es requerido';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Formato de correo inválido';
  }
  
  if (!password) {
    errors.password = 'La contraseña es requerida';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Componente para credenciales de prueba
const CredencialesPrueba = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.testContainer}>
    <Text style={styles.testTitle}>Credenciales de Prueba</Text>
    <Text style={styles.testDescription}>
      Toca aquí para rellenar automáticamente los datos de inicio de sesión.
    </Text>
    <View style={styles.credentials}>
      <Text style={styles.credText}>Email: developer@test.com</Text>
      <Text style={styles.credText}>Contraseña: 123456</Text>
    </View>
  </TouchableOpacity>
);

export default function PantallaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(initialState);
  const router = useRouter();

  const manejarLogin = () => {
    const resultadoValidacion = validateLogin({ email, password });

    if (resultadoValidacion) {
      const newErrors = { ...initialState, ...resultadoValidacion };
      setErrors(newErrors);
      Alert.alert('Error de Validación', 'Por favor, corrige los errores antes de continuar.');
    } else {
      setErrors(initialState);
      router.push('/paginaPrincipal');
    }
  };

  const handleFillCredentials = () => {
    setEmail('developer@test.com');
    setPassword('123456');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            placeholderTextColor={Colors.lightBrown}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={Colors.lightBrown}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={manejarLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <CredencialesPrueba onPress={handleFillCredentials} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    color: Colors.black,
    backgroundColor: Colors.offWhite,
    fontSize: 16,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: Colors.brown,
    borderRadius: 10,
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.offWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  testContainer: {
    backgroundColor: Colors.subtleGray,
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.brown,
    marginBottom: 5,
  },
  testDescription: {
    fontSize: 14,
    color: Colors.textSubtle,
    marginBottom: 10,
  },
  credentials: {
    marginTop: 5,
  },
  credText: {
    fontSize: 14,
    color: Colors.textSubtle,
  },
});