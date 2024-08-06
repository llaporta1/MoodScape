import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { firestore, auth } from '../../firebase/firebaseConfigs';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import Menu from '../components/Menu';

const HomeScreen = ({ navigateTo }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [userPost, setUserPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const now = new Date();
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const friendsList = userDoc.data().friends || [];
            const allUids = [user.uid, ...friendsList];
            
            const postsQuery = query(collection(firestore, 'posts'), where('userId', 'in', allUids));
            onSnapshot(postsQuery, (querySnapshot) => {
              const postsData = [];
              querySnapshot.forEach((doc) => {
                const post = { id: doc.id, ...doc.data() };
                const postTime = post.timestamp.toDate();
                const timeDifference = (now - postTime) / (1000 * 60 * 60); // Difference in hours
                if (timeDifference <= 24) {
                  postsData.push(post);
                  if (post.userId === user.uid) {
                    setUserPost(post);
                  }
                }
              });
              setPosts(postsData);
            });
          }
        }
      } catch (err) {
        console.error('Error fetching posts: ', err);
        setError('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, []);

  const handleMyFlixPress = () => {
    if (userPost) {
      navigateTo('MyFlixExisting', { post: userPost });
    } else {
      navigateTo('MyFlix');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <Image source={{ uri: item.imageUri }} style={styles.postImage} />
      <Text style={styles.postUsername}>{item.username}</Text>
      <Text style={styles.postCaption}>{item.caption}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Menu navigateTo={navigateTo} />
      <View style={styles.inner}>
        <Text style={styles.text}>Home</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
        />
        <TouchableOpacity style={styles.myFlixButton} onPress={handleMyFlixPress}>
          <Image source={require('../../assets/my-flix.png')} style={styles.myFlixIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: '#000000',
    marginVertical: 10,
  },
  flatListContent: {
    alignItems: 'center',
  },
  post: {
    marginBottom: 20,
    padding: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '90%',
    backgroundColor: '#fff',
  },
  postImage: {
    width: width * 0.8,
    height: width * 0.8,
    alignSelf: 'center',
  },
  postUsername: {
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  postCaption: {
    marginTop: 5,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  myFlixButton: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myFlixIcon: {
    width: 60,
    height: 60,
  },
});

export default HomeScreen;
