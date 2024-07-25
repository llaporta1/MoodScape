import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>
    </View>
  )}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    text: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
  });
  
//     <View style={styles.container}>
//       <Text style={styles.title}>FLIX</Text>
//       <View style={styles.inputContainer}>
//         <Icon name="person" size={20} color="#fff" style={styles.icon} />
//         <TextInput placeholder="username" placeholderTextColor="#fff" style={styles.input} />
//       </View>
//       <View style={styles.inputContainer}>
//         <Icon name="lock" size={20} color="#fff" style={styles.icon} />
//         <TextInput placeholder="password" placeholderTextColor="#fff" secureTextEntry style={styles.input} />
//       </View>
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Log in</Text>
//       </TouchableOpacity>
//       <Text style={styles.signupText}>
//         New to Flix? <Text style={styles.signupLink}>Sign Up Now</Text>
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#004d40',
//   },
//   title: {
//     fontSize: 50,
//     color: 'white',
//     fontFamily: 'PlaywriteDanmarkLoopet', // Ensure this matches your custom font
//     marginBottom: 50,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#fff',
//     width: '80%',
//   },
//   icon: {
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     padding: 10,
//     color: '#fff',
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 25,
//     width: '80%',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#004d40',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   signupText: {
//     color: 'white',
//   },
//   signupLink: {
//     color: '#ffd700',
//     fontWeight: 'bold',
//   },
// });

export default LoginScreen;
