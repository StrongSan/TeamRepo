import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import RegionSelectionScreen from '../screens/RegionSelectionScreen';
import MainScreen from '../screens/MainScreen';
//import MailScreen from '../screens/MailScreen';
import SellerWriting from '../screens/SellerWriting';
import ProfileScreen from '../screens/ProfileScreen';
//import MoreScreen from '../screens/MoreScreen';

export type RootStackParamList = {
  Login: undefined;
  RegionSelection: {
    previousData?: {
      nickname: string;
      userType: 'seller' | 'customer' | null;
      selectedCakes: number[];
    };
  };
  ProfileSetup: {
    location?: string;
    nickname?: string;
    userType?: 'seller' | 'customer' | null;
    selectedCakes?: number[];
  };
  MainScreen: {
    userType: "seller" | "customer";
  };
  MailScreen: undefined;       
  SellerWriting: undefined;   
  ProfileScreen: { userType: "seller" | "customer" };
  MoreScreen: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();


const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="RegionSelection" component={RegionSelectionScreen} />
      <Stack.Screen name="MainScreen" component={MainScreen} />
      {/*<Stack.Screen name="MailScreen" component={MailScreen} />*/}
      <Stack.Screen name="SellerWriting" component={SellerWriting} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      {/*<Stack.Screen name="MoreScreen" component={MoreScreen} />*/}

    </Stack.Navigator>
  );
};

export default AppNavigator;
