import { useCallback } from 'react';
import { Alert } from 'react-native';
import { loginWithKakao } from '../api/authAPI';
import { TokenManager } from '../utils/tokenManager';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import KakaoNativeLogin from '../utils/KakaoNativeModule';

export const useKakaoLogin = () => {
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const handleKakaoLogin = useCallback(async () => {
    try {
      const result = await KakaoNativeLogin.login();
      
      // 사용자 프로필 정보 가져오기 (고유 ID 포함)
      const profile = await KakaoNativeLogin.getProfile();
      
      // 백엔드로 액세스 토큰 전달
      const backendResponse = await loginWithKakao(result.accessToken);
      
      // 백엔드 응답에 따른 분기 처리
      if (backendResponse.status === 'NEED_REGISTER') {
        // PhoneAuth로 이동 (전화번호 인증)
        navigation.navigate('PhoneAuth', {
          userId: profile.id,
          kakaoId: profile.id,
          nickname: profile.nickname || '',
          profileImg: profile.profileImage || '',
        });
      } else if (backendResponse.status === 'OK') {
        // JWT 토큰 저장 (액세스 토큰 + 리프레시 토큰)
        if (backendResponse.accessToken) {
          if (backendResponse.refreshToken) {
            await TokenManager.saveTokens(backendResponse.accessToken, backendResponse.refreshToken);
          } else {
            await TokenManager.saveAccessToken(backendResponse.accessToken);
          }
        }
        
        // MainScreen으로 이동 (백엔드에서 받은 정보 사용)
        navigation.navigate('MainScreen', {
          userId: (backendResponse.user?.id || profile.id).toString(),
          userType: backendResponse.user?.userType || 'customer',
        });
      } else {
        // 예상치 못한 응답
        console.warn('예상치 못한 백엔드 응답:', backendResponse);
        Alert.alert('오류', '로그인 처리 중 문제가 발생했습니다.');
      }
      
    } catch (error) {
      console.error(' 카카오 로그인 실패:', error);
      
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
