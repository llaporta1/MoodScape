// src/screens/MainScreen.js
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const MainScreen = () => (
  <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.text}>F  L  I  X</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#013220',
  },
  text: {
    fontSize: 60,
    color: '#D2B48C',
    fontWeight: 'bold',
  },
});

export default MainScreen;
