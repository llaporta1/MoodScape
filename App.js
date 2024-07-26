import * as React from 'react';
import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Keyboard } from 'react-native';
import { auth, firestore, firebaseConfig } from './firebase/firebaseConfigs';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Main');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');

  useEffect(() => {
    if (currentScreen === 'Main') {
      const timer = setTimeout(() => {
        setCurrentScreen('Home');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleLogin = () => {
    console.log("API Key: ", firebaseConfig.apiKey);
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Login successful', `Welcome back, ${user.email}`);
      })
      .catch((error) => {
        Alert.alert('Login failed', error.message);
      });
  };

  const handleRegister = async () => {
    try {
      console.log("API Key: ", firebaseConfig.apiKey);
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      await setDoc(doc(firestore, 'users', user.uid), {
        username: registerUsername,
        email: user.email
      });
      Alert.alert('Registration successful', `Welcome, ${user.email}`);
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    }
  };

  const Main = () => (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>F  L  I  X</Text>
      </View>
    </SafeAreaView>
  );

  const Home = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.text}>F  L  I  X</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#D2B48C"
          value={loginEmail}
          onChangeText={text => setLoginEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#D2B48C"
          secureTextEntry
          value={loginPassword}
          onChangeText={text => setLoginPassword(text)}
          autoCapitalize="none"
          textContentType="password"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setLoginEmail('');
          setLoginPassword('');
          setCurrentScreen('Register');
        }}>
          <Text style={styles.signUpText}>
            New to Flix? <Text style={styles.signUpLink}>Sign Up Now</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const Register = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.text}>F  L  I  X</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#D2B48C"
          value={registerUsername}
          onChangeText={text => setRegisterUsername(text)}
          autoCapitalize="none"
          textContentType="username"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#D2B48C"
          value={registerEmail}
          onChangeText={text => setRegisterEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#D2B48C"
          secureTextEntry
          value={registerPassword}
          onChangeText={text => setRegisterPassword(text)}
          autoCapitalize="none"
          textContentType="newPassword"
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setRegisterUsername('');
          setRegisterEmail('');
          setRegisterPassword('');
          setCurrentScreen('Home');
        }}>
          <Text style={styles.signUpText}>
            Already have an account? <Text style={styles.signUpLink}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return currentScreen === 'Main' ? <Main /> : currentScreen === 'Home' ? <Home /> : <Register />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#013220', // Dark forest green background color
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 60, // Large font size
    color: '#D2B48C', // Tan/Beige gold text color for FLIX logo
    fontWeight: 'bold', // Bold text
  },
  button: {
    marginTop: 20, // Add some space between the text and the button
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#D2B48C', // Tan/Beige gold button color
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20, // Adjust font size if needed
    color: '#013220', // Dark forest green text color for button
    fontWeight: 'bold', // Bold text for button
  },
  input: {
    width: '80%',
    color: '#D2B48C',
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
    marginVertical: 10,
  },
  signUpText: {
    marginTop: 20,
    color: '#D2B48C',
    fontSize: 16,
  },
  signUpLink: {
    color: '#D2B48C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default App;
