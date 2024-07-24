import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from './firebaseConfigs';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // from Firebase console
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const signUp = (email, password) => auth.createUserWithEmailAndPassword(email, password);
  const login = (email, password) => auth.signInWithEmailAndPassword(email, password);

  const googleSignIn = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth.signInWithCredential(googleCredential);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => auth.signOut();

  const value = {
    currentUser,
    signUp,
    login,
    googleSignIn,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
