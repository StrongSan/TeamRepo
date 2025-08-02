import { useCallback } from 'react';
import { Alert } from 'react-native';
import { loginWithKakao } from '../api/authAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import KakaoNativeLogin from '../utils/KakaoNativeModule';

export const useKakaoLogin = () => {
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const handleKakaoLogin = useCallback(async () => {
    try {
      console.log('🟡 [카카오 로그인 시도] 시작');
      console.log('🔧 현재 환경:', __DEV__ ? '개발' : '프로덕션');
      
      // 실제 카카오 로그인 시도
      console.log('📱 실제 카카오 로그인 시도...');
      
      const result = await KakaoNativeLogin.login();
      
      console.log('✅ 카카오 로그인 성공');
      console.log('🎉 액세스 토큰 (전체):', result.accessToken);
      console.log('🎉 리프레시 토큰 (전체):', result.refreshToken);
      console.log('🎉 만료 시간:', result.expiresAt);
      console.log('🎉 스코프:', result.scopes);
      
      // 로그인 성공 시 ProfileSetupScreen으로 이동
      console.log('🔄 ProfileSetupScreen으로 이동...');
      navigation.navigate('ProfileSetup', {});
      console.log('✅ ProfileSetupScreen 이동 완료');
      
      console.log('🎉 카카오 로그인 프로세스 완료');
      
    } catch (error) {
      console.error('❌ 카카오 로그인 실패:', error);
      
      let errorMessage = '카카오 로그인 중 오류가 발생했습니다.';
      
      if (error && typeof error === 'object' && 'code' in error) {
        switch (error.code) {
          case 'CANCELLED':
            errorMessage = '로그인이 취소되었습니다.';
            break;
          case 'NO_ACTIVITY':
            errorMessage = '앱 상태에 문제가 있습니다. 앱을 다시 시작해주세요.';
            break;
          default:
            errorMessage = `로그인 오류: ${(error as any).message || '알 수 없는 오류'}`;
        }
      }
      
      Alert.alert('로그인 실패', errorMessage);
    }
  }, [navigation]);

  return { handleKakaoLogin };
};
