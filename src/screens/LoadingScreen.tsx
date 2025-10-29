import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { verifyToken } from '../api/authAPI';
import { TokenManager } from '../utils/tokenManager';
import Logo from '../components/Logo';

const { width } = Dimensions.get("window");
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 768;

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginButtons, setShowLoginButtons] = useState(false);

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      console.log(' 자동 로그인 확인 시작...');
      
      // 토큰 존재 여부 확인
      const hasTokens = await TokenManager.hasTokens();
      if (!hasTokens) {
        console.log(' 토큰 없음, 로그인 화면으로 이동');
        setShowLoginButtons(true);
        setIsLoading(false);
        return;
      }

      console.log(' 토큰 검증 중...');
      
      // 토큰 검증
      const result = await verifyToken();
      
      if (result.valid && result.userId && result.userType) {
        console.log('✅ 자동 로그인 성공:', {
          userId: result.userId,
          userType: result.userType,
          nickname: result.nickname
        });
        
        // MainScreen으로 이동
        navigation.replace('MainScreen', {
          userId: result.userId.toString(),
          userType: result.userType as 'seller' | 'customer'
        });
      } else {
        console.log('❌ 토큰 검증 실패 (토큰 만료 또는 무효), 로그인 화면 표시');
        
        // 만료된 토큰들을 삭제
        await TokenManager.clearTokens();
        console.log('🗑️ 만료된 토큰 삭제 완료');
        
        setShowLoginButtons(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ 자동 로그인 확인 중 오류:', error);
      
      // 에러 발생 시에도 토큰 삭제
      await TokenManager.clearTokens();
      console.log('🗑️ 에러 발생으로 인한 토큰 삭제 완료');
      
      setShowLoginButtons(true);
      setIsLoading(false);
    }
  };

  const handleLoginPress = () => {
    navigation.replace('Login');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Logo />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E78182" />
            <Text style={styles.loadingText}>로그인 확인 중...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (showLoginButtons) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Logo />
          <View style={styles.buttonContainer}>
            <Text style={styles.loginPrompt}>로그인이 필요합니다</Text>
            <View style={styles.loginButton} onTouchEnd={handleLoginPress}>
              <Text style={styles.loginButtonText}>로그인 하기</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingRight: 49,
    paddingBottom: 67,
    paddingLeft: 49,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 100,
    width: "100%",
    maxWidth: 292,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#70756b',
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 30,
    width: "100%",
  },
  loginPrompt: {
    fontSize: 16,
    color: '#363a33',
    fontFamily: 'Poppins',
    fontWeight: '500',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#E78182',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
});

export default LoadingScreen;
