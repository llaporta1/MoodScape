import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { firestore, auth } from '../../firebase/firebaseConfigs';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import Menu from '../components/Menu';

const HomeScreen = ({ navigateTo }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [userHasValidPost, setUserHasValidPost] = useState(false);

  useEffect(() => {
    const checkUserPostValidity = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const now = new Date();
          const postsQuery = query(collection(firestore, 'posts'), where('userId', '==', user.uid));
          onSnapshot(postsQuery, (querySnapshot) => {
            let validPostExists = false;

            querySnapshot.forEach((doc) => {
              const post = doc.data();
              const postTime = post.timestamp.toDate();
              const timeDifference = (now - postTime) / (1000 * 60 * 60); // Difference in hours

              if (timeDifference <= 24) {
                validPostExists = true;
              }
            });

            setUserHasValidPost(validPostExists);

            if (validPostExists) {
              fetchFriendsPosts(user);
            }
          });
        }
      } catch (err) {
        console.error('Error checking user post validity: ', err);
        setError('Failed to check user post validity');
      }
    };

    const fetchFriendsPosts = async (user) => {
      try {
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
              }
            });
            setPosts(postsData);
          });
        }
      } catch (err) {
        console.error('Error fetching friends posts: ', err);
        setError('Failed to fetch friends posts');
      }
    };

    checkUserPostValidity();
  }, []);

  const handleMyFlixPress = () => {
    if (userHasValidPost) {
      navigateTo('MyFlixExisting', { post: userPost });
    } else {
      navigateTo('MyFlix');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <View style={styles.userInfo}>
        <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <Image source={{ uri: item.imageUri }} style={styles.postImage} />
      <Text style={styles.postCaption}>{item.caption}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Menu navigateTo={navigateTo} />
      <View style={styles.inner}>
        <Text style={styles.text}>Home</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!userHasValidPost ? (
          <TouchableOpacity onPress={() => navigateTo('MyFlix')}>
            <Text style={styles.promptText}>Share your flix to see your friends</Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContent}
          />
        )}
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: width * 0.8,
    height: width * 0.8,
    alignSelf: 'center',
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
  promptText: {
    fontSize: 18,
    color: '#8b8680',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
