// ✅ AppNavigator.tsx (수정 완료본)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import RegionSelectionScreen from '../screens/RegionSelectionScreen';
import MainScreen from '../screens/MainScreen';
import SellerWriting from '../screens/SellerWriting';
import ProfileScreen from '../screens/ProfileScreen';
import MypageScreen from '../screens/MypageScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CakeOrderForm from '../screens/CakeOrderForm';
import PaymentScreen from '../screens/PaymentScreen';
import MyStoreReviewScreen from '../screens/MyStoreReviewScreen';

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
    userId: number; // ✅ 추가됨
    userType: 'seller' | 'customer';
  };
  SellerWriting: undefined;
  ProfileScreen: { userType: 'seller' | 'customer' };
  MypageScreen: { userType: 'seller' | 'customer' };
  ProductDetail: {
    userType: 'seller' | 'customer';
    post: {
      postId: number;
      title: string;
      imageUrl: string;
      price: string;
      description: string;
    };
    userId: number;
  };
  CakeOrderForm: { postId: number };
  Payment: { 
    postId: number;
   };
  MyStoreReview: {
  storeId: number;           // 가게 고유 ID
  storeName: string;         // 가게 이름
  profileImageUrl: string;   // 가게 프로필 이미지
  rating: number;            // 평균 별점
  userId: number;            // 로그인한 사용자 ID (판매자 ID)
};

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <Stack.Screen name="RegionSelection" component={RegionSelectionScreen} />
    <Stack.Screen name="MainScreen" component={MainScreen} />
    <Stack.Screen name="SellerWriting" component={SellerWriting} />
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="MypageScreen" component={MypageScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="CakeOrderForm" component={CakeOrderForm} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="MyStoreReview" component={MyStoreReviewScreen} />
  </Stack.Navigator>
);

export default AppNavigator;