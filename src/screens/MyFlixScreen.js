import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore, auth } from '../../firebase/firebaseConfigs';
import { setDoc, doc, collection, addDoc } from 'firebase/firestore';

const MyFlixScreen = ({ navigateTo }) => {
  const [caption, setCaption] = useState('');
  const [error, setError] = useState(null);

  const handleCreatePost = async () => {
    const randomImageUri = `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;

    try {
      const user = auth.currentUser;
      if (user) {
        const newPost = {
          userId: user.uid,
          username: user.displayName,
          imageUri: randomImageUri,
          caption: caption,
          timestamp: new Date(),
        };

        await addDoc(collection(firestore, 'posts'), newPost);
        setCaption('');
        setError(null);
        alert('Post created successfully!');
      } else {
        setError('User not authenticated');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigateTo('Home')}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create a Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter caption"
        value={caption}
        onChangeText={setCaption}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity onPress={handleCreatePost} style={styles.button}>
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
});

export default MyFlixScreen;
