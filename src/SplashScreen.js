// src/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();
  const positionX = {
    F: useSharedValue(-width),
    L: useSharedValue(-width),
    I: useSharedValue(width),
    X: useSharedValue(width),
  };

  useEffect(() => {
    positionX.F.value = withTiming(width * 0.3, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
    positionX.L.value = withTiming(width * 0.4, {
      duration: 1200,
      easing: Easing.out(Easing.exp),
    });
    positionX.I.value = withTiming(width * 0.5, {
      duration: 1400,
      easing: Easing.out(Easing.exp),
    });
    positionX.X.value = withTiming(width * 0.6, {
      duration: 1600,
      easing: Easing.out(Easing.exp),
    });

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyleF = useAnimatedStyle(() => ({
    transform: [{ translateX: positionX.F.value }],
  }));

  const animatedStyleL = useAnimatedStyle(() => ({
    transform: [{ translateX: positionX.L.value }],
  }));

  const animatedStyleI = useAnimatedStyle(() => ({
    transform: [{ translateX: positionX.I.value }],
  }));

  const animatedStyleX = useAnimatedStyle(() => ({
    transform: [{ translateX: positionX.X.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, animatedStyleF]}>F</Animated.Text>
      <Animated.Text style={[styles.text, animatedStyleL]}>L</Animated.Text>
      <Animated.Text style={[styles.text, animatedStyleI]}>I</Animated.Text>
      <Animated.Text style={[styles.text, animatedStyleX]}>X</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
