import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth, firestore } from '../../firebase/firebaseConfigs';
import { getDoc, doc } from 'firebase/firestore';
import Menu from '../components/Menu';

const MyProfileScreen = ({ navigateTo }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicUri, setProfilePicUri] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFullName(userData.fullName || ''); // Set full name
            setUsername(userData.username);
            setEmail(userData.email);
            setPassword('••••••••'); // Hidden password placeholder
            setProfilePicUri(userData.profilePicUri || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Menu navigateTo={navigateTo} />
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
        <TouchableOpacity onPress={() => navigateTo('Home')}>
          <Image
            source={profilePicUri ? { uri: profilePicUri } : require('../../assets/profile-placeholder.png')}
            style={styles.profilePicHeader}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profilePicHolder}>
          <Image
            source={profilePicUri ? { uri: profilePicUri } : require('../../assets/profile-placeholder.png')}
            style={styles.profilePic}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Full Name</Text>
          <TextInput value={fullName} onChangeText={setFullName} style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text>Username</Text>
          <TextInput value={username} onChangeText={setUsername} style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text>Email</Text>
          <TextInput value={email} onChangeText={setEmail} style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
        </View>
        <TouchableOpacity>
          <Text style={styles.changePasswordText}>Change my password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profilePicHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d3d3d3',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  profilePicHolder: {
    position: 'relative',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#d3d3d3',
  },
  inputContainer: {
    width: '80%',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  changePasswordText: {
    marginTop: 20,
    color: 'blue',
  },
});

export default MyProfileScreen;
