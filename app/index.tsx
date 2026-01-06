import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import Colors from './constants/Colors';
import { validateLogin } from '../lib/validation';

export default function PantallaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const manejarLogin = () => {
    const resultadoValidacion = validateLogin({ email, password });

    if (resultadoValidacion) {
      setErrors(resultadoValidacion);
      Alert.alert('Error de Validación', 'Por favor, corrige los errores antes de continuar.');
    } else {
      setErrors({});
      Alert.alert('Inicio de Sesión Exitoso', `Correo: ${email}, Contraseña: ${password}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor={Colors.lightBrown}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={Colors.lightBrown}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
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
    backgroundColor: Colors.offWhite,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 30,
    textAlign: 'center',
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
    color: 'red',
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
  }
});
