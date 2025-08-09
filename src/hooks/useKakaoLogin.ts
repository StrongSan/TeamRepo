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
      console.log(' [카카오 로그인 시도] 시작');
      console.log(' 현재 환경:', __DEV__ ? '개발' : '프로덕션');
      
      // 실제 카카오 로그인 시도
      console.log('📱 실제 카카오 로그인 시도...');
      
      const result = await KakaoNativeLogin.login();
      
      console.log(' 카카오 로그인 성공');
      console.log(' 액세스 토큰 (전체):', result.accessToken);
      console.log(' 리프레시 토큰 (전체):', result.refreshToken);
      console.log(' 만료 시간:', result.expiresAt);
      console.log(' 스코프:', result.scopes);
      
      // 사용자 프로필 정보 가져오기 (고유 ID 포함)
      console.log(' 사용자 프로필 정보 조회 중...');
      const profile = await KakaoNativeLogin.getProfile();
      
      console.log(' 사용자 프로필 조회 성공');
      console.log(' 카카오 사용자 고유 ID:', profile.id);
      console.log(' 닉네임:', profile.nickname);
      console.log(' 이메일:', profile.email);
      console.log(' 프로필 이미지:', profile.profileImage);
      console.log(' 썸네일 이미지:', profile.thumbnailImage);
      
      // 백엔드로 액세스 토큰 전달
      console.log('🌐 백엔드로 액세스 토큰 전송 중...');
      const backendResponse = await loginWithKakao(result.accessToken);
      
      console.log('✅ 백엔드 응답 성공:', backendResponse);
      
      // 백엔드 응답에 따른 분기 처리
      if (backendResponse.status === 'NEED_REGISTER') {
        console.log('🆕 신규 사용자 - 회원가입 필요');
        // ProfileSetupScreen으로 이동 (회원가입 정보 입력)
        navigation.navigate('ProfileSetup', {
          kakaoId: profile.id,
          nickname: profile.nickname || '',
          profileImg: profile.profileImage || '',
        });
      } else if (backendResponse.status === 'OK') {
        console.log('✅ 기존 사용자 - 로그인 완료');
        // MainScreen으로 이동 (백엔드에서 받은 정보 사용)
        navigation.navigate('MainScreen', {
          userId: backendResponse.user?.id || parseInt(profile.id),
          userType: backendResponse.user?.userType || 'customer',
        });
      } else {
        // 예상치 못한 응답
        console.warn('⚠️ 예상치 못한 백엔드 응답:', backendResponse);
        Alert.alert('오류', '로그인 처리 중 문제가 발생했습니다.');
      }
      
      console.log(' 카카오 로그인 프로세스 완료');
      
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
