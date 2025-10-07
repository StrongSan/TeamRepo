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
import MyReservationsScreen from '../screens/MyReservationsScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ReviewWriteScreen from '../screens/ReviewWriteScreen';
import MyReviewsScreen from '../screens/MyReviewsScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';

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
  CakeOrderForm: { 
    postId: number; 
    userId?: string; 
    userType?: 'seller' | 'customer';
    price?: string; // 게시글 가격 정보 추가
  };
  Payment: { 
    postId: number;
    userId?: string;
    userType?: 'seller' | 'customer';
   };
   WishList: { userId: string; userType: 'seller' | 'customer' };
   MyReservations: { userId: string; userType: 'seller' | 'customer'; initialTab?: 'IN_PROGRESS' | 'COMPLETED' };
   OrderDetail: { orderId: string; userId: string };
   ReorderFlow: { orderId: string };
   WriteReview: { orderId: string; userId: string };
   MyReviews: { userId: string };
   ChatList: { userId: string; userType: 'seller' | 'customer' };
   ChatRoom: { 
     roomId: string; 
     userId: string; 
     userType: 'seller' | 'customer';
     sellerId?: number;
     customerId?: number;
     productId?: number;
     isNewRoom?: boolean;
     messageCount?: number;
   };
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
    <Stack.Screen name="MyReservations" component={MyReservationsScreen} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    <Stack.Screen 
      name="WriteReview" 
      component={ReviewWriteScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen name="MyReviews" component={MyReviewsScreen} />
    <Stack.Screen 
      name="ChatList" 
      component={ChatListScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen 
      name="ChatRoom" 
      component={ChatRoomScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;