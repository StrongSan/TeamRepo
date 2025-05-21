import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import RegionSelectionScreen from '../screens/RegionSelectionScreen';
import MainScreen from '../screens/MainScreen';
// import MailScreen from '../screens/MailScreen';
import SellerWriting from '../screens/SellerWriting';
import ProfileScreen from '../screens/ProfileScreen';
import MypageScreen from '../screens/MypageScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen'; // ✅ 추가: 상세화면 import

// ✅ 변경: ProductDetail route 타입 정의 추가
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
  MainScreen: { userType: "seller" | "customer" };
  // MailScreen: undefined; // ❌ 주석 처리 방식 수정
  SellerWriting: undefined;
  ProfileScreen: { userType: "seller" | "customer" };
  MypageScreen: { userType: "seller" | "customer" };

  // ✅ 추가: 상세 페이지 라우팅 타입
  ProductDetail: {
    userType: 'seller' | 'customer';
    post: {
      postId: number;
      title: string;
      imageUrl: string;
      price: string;
      description: string;
    };
  };
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
      {/* ↓↓↓ 이런 방식은 Navigator 안에서 오류 유발하므로 제거 또는 JS 주석으로 */}
      {/* <Stack.Screen name="MailScreen" component={MailScreen} /> */}
      <Stack.Screen name="SellerWriting" component={SellerWriting} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="MypageScreen" component={MypageScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
