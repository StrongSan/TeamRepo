// ✅ AppNavigator.tsx (수정 완료본)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import RegionSelectionScreen from '../screens/RegionSelectionScreen';
import PhoneAuthScreen from '../screens/PhoneAuthScreen';
import MainScreen from '../screens/MainScreen';
import SellerWriting from '../screens/SellerWriting';
import ProfileScreen from '../screens/ProfileScreen';
import MypageScreen from '../screens/MypageScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CakeOrderForm from '../screens/CakeOrderForm';
import PaymentScreen from '../screens/PaymentScreen';
import WishListScreen from '../screens/WishListScreen';

export type RootStackParamList = {
  Login: undefined;
  RegionSelection: {
    previousData?: {
      nickname: string;
      userType: 'seller' | 'customer' | null;
      selectedCakes: number[];
      kakaoId?: string; // ✅ kakaoId 추가
    };
  };
  ProfileSetup: {
    location?: string;
    nickname?: string;
    userType?: 'seller' | 'customer' | null;
    selectedCakes?: number[];
    kakaoId?: string;
    profileImg?: string;
  };
  PhoneAuth: { 
    userId: string; 
    kakaoId: string; 
    nickname: string; 
    profileImg?: string; 
  };
  MainScreen: {
  userId: string; 
  userType: 'seller' | 'customer';
  };
  SellerWriting: undefined;
  ProfileScreen: { userType: 'seller' | 'customer'; userId: string };
  MypageScreen: { userType: 'seller' | 'customer'; userId: string };
  ProductDetail: {
    userType: 'seller' | 'customer';
    post: {
      postId: number;
      title: string;
      imageUrl: string;
      price: string;
      description: string;
    };
    userId: string;
  };
  CakeOrderForm: { postId: number };
  Payment: { 
    postId: number;
   };
   WishList: { userId: string; userType: 'seller' | 'customer' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  
  <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <Stack.Screen name="RegionSelection" component={RegionSelectionScreen} />
    <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
    <Stack.Screen name="MainScreen" component={MainScreen} />
    <Stack.Screen name="SellerWriting" component={SellerWriting} />
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="MypageScreen" component={MypageScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="CakeOrderForm" component={CakeOrderForm} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="WishList" component={WishListScreen} />
  </Stack.Navigator>
);

export default AppNavigator;