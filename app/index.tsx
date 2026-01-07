import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const initialState = { email: '', password: '' };

// Función de validación inline
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#A0826D"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#A0826D"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={manejarLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FAF9F6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    color: '#000000',
    backgroundColor: '#FAF9F6',
    fontSize: 16,
  },
  errorText: {
    color: '#FF0000',
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#8B4513',
    borderRadius: 10,
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FAF9F6',
    fontSize: 18,
    fontWeight: 'bold',
  }
});