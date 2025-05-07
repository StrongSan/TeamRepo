import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import RegionSelectionScreen from './src/screens/RegionSelectionScreen';
import MainScreen from './src/screens/MainScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CakeOrderForm from './src/screens/CakeOrderForm';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import SellerWriting from './src/screens/SellerWriting';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

/*
//앱 화면 임시로 보이게
export default function App() {
  return (
    <NavigationContainer>
      <CakeOrderForm />
    </NavigationContainer>
  );
}
*/


export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

