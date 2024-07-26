import * as React from 'react';
import { useState, useEffect } from 'react';
import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import { Alert } from 'react-native';
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
        setCurrentScreen('Login');
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
        setCurrentScreen('Home'); // Navigate to HomeScreen after successful login
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
      setCurrentScreen('Home'); // Navigate to HomeScreen after successful registration
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    }
  };

  if (currentScreen === 'Main') {
    return <MainScreen />;
  } else if (currentScreen === 'Login') {
    return (
      <LoginScreen
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleLogin={handleLogin}
        setCurrentScreen={setCurrentScreen}
      />
    );
  } else if (currentScreen === 'Register') {
    return (
      <RegisterScreen
        registerUsername={registerUsername}
        setRegisterUsername={setRegisterUsername}
        registerEmail={registerEmail}
        setRegisterEmail={setRegisterEmail}
        registerPassword={registerPassword}
        setRegisterPassword={setRegisterPassword}
        handleRegister={handleRegister}
        setCurrentScreen={setCurrentScreen}
      />
    );
  } else if (currentScreen === 'Home') {
    return <HomeScreen />;
  }
};

export default App;
