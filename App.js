import * as React from 'react';
import { useState, useEffect } from 'react';
import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyFriendsScreen from './src/screens/MyFriendsScreen';
import MemoriesScreen from './src/screens/MemoriesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpScreen from './src/screens/HelpScreen';
import MyProfileScreen from './src/screens/MyProfileScreen'; // Add this import
import { Alert } from 'react-native';
import { auth, firestore } from './firebase/firebaseConfigs';
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
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      await setDoc(doc(firestore, 'users', user.uid), {
        username: registerUsername,
        email: user.email,
        friends: [], // Initialize empty list of friends
        profilePicUri: "" // Initialize empty profile picture URI
      });
      Alert.alert('Registration successful', `Welcome, ${user.email}`);
      setCurrentScreen('Home'); // Navigate to HomeScreen after successful registration
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Main':
        return <MainScreen />;
      case 'Login':
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
      case 'Register':
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
      case 'Home':
        return <HomeScreen navigateTo={setCurrentScreen} />;
      case 'MyFriends':
        return <MyFriendsScreen navigateTo={setCurrentScreen} />;
      case 'Memories':
        return <MemoriesScreen navigateTo={setCurrentScreen} />;
      case 'Settings':
        return <SettingsScreen navigateTo={setCurrentScreen} />;
      case 'Help':
        return <HelpScreen navigateTo={setCurrentScreen} />;
      case 'MyProfile': 
        return <MyProfileScreen navigateTo={setCurrentScreen} />;
      default:
        return <MainScreen />;
    }
  };

  return renderScreen();
};

export default App;
