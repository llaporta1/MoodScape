import * as React from 'react';
import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Main');

  useEffect(() => {
    if (currentScreen === 'Main') {
      const timer = setTimeout(() => {
        setCurrentScreen('Home');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const Main = () => (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>F  L  I  X</Text>
      </View>
    </SafeAreaView>
  );

  const Home = () => (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>F  L  I  X</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor="#D2B48C"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#D2B48C"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCurrentScreen('Register')}>
        <Text style={styles.signUpText}>
          New to Flix? <Text style={styles.signUpLink}>Sign Up Now</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const Register = () => (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>F  L  I  X</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor="#D2B48C"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#D2B48C"
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="email"
          placeholderTextColor="#D2B48C"
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCurrentScreen('Home')}>
        <Text style={styles.signUpText}>
          Already have an account? <Text style={styles.signUpLink}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return currentScreen === 'Main' ? <Main /> : currentScreen === 'Home' ? <Home /> : <Register />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#013220', // Dark forest green background color
  },
  text: {
    fontSize: 60, // Large font size
    color: '#D2B48C', // Tan/Beige gold text color for FLIX logo
    fontWeight: 'bold', // Bold text
  },
  button: {
    marginTop: 20, // Add some space between the text and the button
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#D2B48C', // Tan/Beige gold button color
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20, // Adjust font size if needed
    color: '#013220', // Dark forest green text color for button
    fontWeight: 'bold', // Bold text for button
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
    marginTop: 20,
  },
  input: {
    flex: 1,
    color: '#D2B48C',
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  signUpText: {
    marginTop: 20,
    color: '#D2B48C',
    fontSize: 16,
  },
  signUpLink: {
    color: '#D2B48C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default App;
