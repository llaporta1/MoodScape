import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';

const firebaseConfig = {
    apiKey: "AlzaSyBtjTy56MlbVBXuZ-nGFjxbuWyb4hysWqM",
    authDomain: "moodscape-592de.firebaseapp.com",
    projectId: "moodscape-592de",
    storageBucket: "moodscape-592de.appspot.com",
    messagingSenderId: "923938596144",
    appId: "1:923938596144:ios:b3aa74919b9ecd2b0"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
