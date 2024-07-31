import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import Menu from '../components/Menu';

const HomeScreen = ({ navigateTo }) => (
  <SafeAreaView style={styles.container}>
    <Menu navigateTo={navigateTo} />
    <View style={styles.inner}>
      <Text style={styles.text}>Home</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
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
});

export default HomeScreen;
