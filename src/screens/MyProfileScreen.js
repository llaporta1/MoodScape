import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import Menu from '../components/Menu';

const MyProfileScreen = ({ navigateTo }) => (
  <SafeAreaView style={styles.container}>
    <Menu navigateTo={navigateTo} />
    <View style={styles.inner}>
      <Text style={styles.text}>My Profile</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#000000',
  },
});

export default MyProfileScreen;
