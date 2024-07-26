import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigateTo }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(fadeAnim, {
      toValue: menuVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleMenuSelection = (screen) => {
    setMenuVisible(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigateTo(screen);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={32} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.inner}>
        <Text style={styles.text}>Home</Text>
      </View>
      {menuVisible && (
        <Animated.View style={[styles.menuContainer, { opacity: fadeAnim }]}>
          <Text style={styles.menuItem}>Hi, Lauren</Text>
          <TouchableOpacity onPress={() => handleMenuSelection('Home')}>
            <Text style={styles.menuItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuSelection('MyFriends')}>
            <Text style={styles.menuItem}>My friends</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuSelection('Memories')}>
            <Text style={styles.menuItem}>Memories</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuSelection('Settings')}>
            <Text style={styles.menuItem}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuSelection('Help')}>
            <Text style={styles.menuItem}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuSelection('Login')}>
            <Text style={styles.menuItem}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20, // Adjust font size as needed
    color: '#000000', // Black text color
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '80%',
    backgroundColor: '#f4f4f4',
    padding: 16,
    justifyContent: 'center',
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
