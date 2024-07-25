// import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';  // Make sure the path to App.js is correct
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
