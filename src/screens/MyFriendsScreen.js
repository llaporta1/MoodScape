import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { auth, firestore } from '../../firebase/firebaseConfigs';
import { collection, getDocs, query, where, addDoc, updateDoc, doc, getDoc, arrayUnion } from 'firebase/firestore';
import Menu from '../components/Menu';

const MyFriendsScreen = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState('addFriends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [mutualFriends, setMutualFriends] = useState([]);

  useEffect(() => {
    fetchFriendRequests();
    fetchFriendsList();
  }, []);

  const fetchFriendRequests = async () => {
    const userId = auth.currentUser.uid;
    const friendRequestsRef = collection(firestore, 'friendRequests');
    const q = query(friendRequestsRef, where('receiverId', '==', userId), where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFriendRequests(requests);
    setRequestCount(requests.length); // Set the count of friend requests
  };

  const fetchFriendsList = async () => {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    const friends = userDoc.data().friends || [];

    const friendsDetails = await Promise.all(
      friends.map(async (friendId) => {
        const friendDocRef = doc(firestore, 'users', friendId);
        const friendDoc = await getDoc(friendDocRef);
        return { id: friendDoc.id, username: friendDoc.data().username };
      })
    );

    setFriendsList(friendsDetails);
  };

  const handleSearch = async () => {
    if (searchQuery.length > 0) {
      try {
        const usersRef = collection(firestore, 'users');
        const q = query(
          usersRef,
          where('username', '>=', searchQuery),
          where('username', '<=', searchQuery + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs
          .map(doc => ({ id: doc.id, username: doc.data().username }))
          .filter(user => user.id !== auth.currentUser.uid); // Ensure the current user is not in the list

        const mutuals = await Promise.all(
          users.map(async (user) => {
            const userDocRef = doc(firestore, 'users', user.id);
            const userDoc = await getDoc(userDocRef);
            const userFriends = userDoc.data().friends || [];
            const mutual = userFriends.filter(friendId => friendsList.some(friend => friend.id === friendId));
            
            const mutualDetails = await Promise.all(
              mutual.map(async (mutualId) => {
                const mutualDocRef = doc(firestore, 'users', mutualId);
                const mutualDoc = await getDoc(mutualDocRef);
                return mutualDoc.data().username;
              })
            );

            return { ...user, mutualFriends: mutualDetails, isFriend: friendsList.some(friend => friend.id === user.id) };
          })
        );

        setSearchResults(mutuals);
      } catch (error) {
        console.error('Error searching users: ', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const sendFriendRequest = async (receiverId) => {
    try {
      const senderId = auth.currentUser.uid;
      
      // Check if the users are already friends
      const senderDocRef = doc(firestore, 'users', senderId);
      const senderDoc = await getDoc(senderDocRef);
      const senderFriends = senderDoc.data().friends || [];
  
      if (senderFriends.includes(receiverId)) {
        alert('You are already friends with this user');
        return;
      }
  
      const receiverDocRef = doc(firestore, 'users', receiverId);
      const receiverDoc = await getDoc(receiverDocRef);
      const receiverFriends = receiverDoc.data().friends || [];
  
      if (receiverFriends.includes(senderId)) {
        alert('You are already friends with this user');
        return;
      }

      // Get the sender's username
      const senderUsername = senderDoc.data().username;

      const friendRequestsRef = collection(firestore, 'friendRequests');
      await addDoc(friendRequestsRef, {
        senderId,
        senderUsername,  // Add sender's username
        receiverId,
        status: 'pending',
        timestamp: Date.now(),
      });
      alert('Friend request sent');
    } catch (error) {
      console.error('Error sending friend request: ', error);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      // Get the friend request data
      const requestRef = doc(firestore, 'friendRequests', requestId);
      const requestDoc = await getDoc(requestRef);
      const { senderId, receiverId } = requestDoc.data();

      // Update the friend request status to 'accepted'
      await updateDoc(requestRef, {
        status: 'accepted',
      });

      // Update the sender's friends list
      const senderDocRef = doc(firestore, 'users', senderId);
      await updateDoc(senderDocRef, {
        friends: arrayUnion(receiverId),
      });

      // Update the receiver's friends list
      const receiverDocRef = doc(firestore, 'users', receiverId);
      await updateDoc(receiverDocRef, {
        friends: arrayUnion(senderId),
      });

      fetchFriendRequests(); // Refresh the friend requests list
      fetchFriendsList(); // Refresh the friends list
      alert('Friend request accepted');
    } catch (error) {
      console.error('Error accepting friend request: ', error);
    }
  };

  const declineFriendRequest = async (requestId) => {
    try {
      const requestRef = doc(firestore, 'friendRequests', requestId);
      await updateDoc(requestRef, {
        status: 'declined',
      });
      fetchFriendRequests(); // Refresh the friend requests list
      alert('Friend request declined');
    } catch (error) {
      console.error('Error declining friend request: ', error);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === 'requests') {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(firestore, 'users', userId);
      await updateDoc(userDocRef, {
        lastViewedRequests: Date.now(),
      });
    } else if (tab === 'friends') {
      fetchFriendsList(); // Fetch the friends list whenever the "My Friends" tab is selected
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Menu navigateTo={navigateTo} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateTo('Menu')}>
          <Image source={require('../../assets/menu-bar.png')} style={styles.menuIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Friends</Text>
        <TouchableOpacity onPress={() => navigateTo('MyProfile')}>
          <Image source={require('../../assets/profile-placeholder.png')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity onPress={() => handleTabChange('addFriends')}>
          <Text style={activeTab === 'addFriends' ? styles.activeTab : styles.inactiveTab}>Add Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('requests')}>
          <Text style={activeTab === 'requests' ? styles.activeTab : styles.inactiveTab}>
            Requests {requestCount > 0 && `(${requestCount})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('friends')}>
          <Text style={activeTab === 'friends' ? styles.activeTab : styles.inactiveTab}>My Friends</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'addFriends' && (
        <View style={styles.inner}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Find friends"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              onSubmitEditing={handleSearch}
              autoCapitalize="none"
            />
          </View>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.friendItem}>
                  <Image source={require('../../assets/profile-placeholder.png')} style={styles.placeholderImage} />
                  <View style={styles.friendItemText}>
                    <Text>{item.username}</Text>
                    {item.mutualFriends.length > 0 && (
                      <TouchableOpacity onPress={() => setMutualFriends(item.mutualFriends)}>
                        <Text style={styles.mutualFriendsText}>{item.mutualFriends.length} mutual friends</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View>
                    {item.isFriend ? (
                      <Text>Friends</Text>
                    ) : (
                      <TouchableOpacity onPress={() => sendFriendRequest(item.id)}>
                        <Text>Send Friend Request</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            />
          ) : (
            searchQuery.length > 0 && <Text style={styles.noResultsText}>No results found</Text>
          )}
        </View>
      )}

      {activeTab === 'requests' && (
        <>
          {friendRequests.length > 0 ? (
            <FlatList
              data={friendRequests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.friendRequestItem}>
                  <Text>{item.senderUsername}</Text>
                  <TouchableOpacity onPress={() => acceptFriendRequest(item.id)}>
                    <Text>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => declineFriendRequest(item.id)}>
                    <Text>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noResultsText}>No Requests</Text>
          )}
        </>
      )}

      {activeTab === 'friends' && (
        <FlatList
          data={friendsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Image source={require('../../assets/profile-placeholder.png')} style={styles.placeholderImage} />
              <Text style={styles.friendItemText}>{item.username}</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.noResultsText} onPress={() => handleTabChange('addFriends')}>
              Find friends
            </Text>
          )}
        />
      )}

      {mutualFriends.length > 0 && (
        <View style={styles.mutualFriendsContainer}>
          <Text style={styles.mutualFriendsHeader}>Mutual Friends</Text>
          {mutualFriends.map((friend, index) => (
            <Text key={index} style={styles.mutualFriendItem}>{friend}</Text>
          ))}
          <TouchableOpacity onPress={() => setMutualFriends([])}>
            <Text style={styles.closeMutualFriends}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
  menuIcon: {
    width: 32,
    height: 32,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d3d3d3',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  activeTab: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  inactiveTab: {
    color: 'gray',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
    textDecorationLine: 'underline',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align text and button to the right
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  friendItemText: {
    flex: 1, // Take up remaining space
    marginLeft: 10,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d3d3d3',
  },
  mutualFriendsText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  friendRequestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  inner: {
    paddingHorizontal: 20,
  },
  mutualFriendsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopColor: 'gray',
    borderTopWidth: 1,
  },
  mutualFriendsHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mutualFriendItem: {
    marginBottom: 5,
  },
  closeMutualFriends: {
    textDecorationLine: 'underline',
    color: 'blue',
    marginTop: 10,
  },
});

export default MyFriendsScreen;
