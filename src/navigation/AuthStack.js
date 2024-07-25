import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Main" component={MainScreen} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;