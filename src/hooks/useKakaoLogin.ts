// src/hooks/useKakaoLogin.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { loginWithKakao } from '../api/authAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export const useKakaoLogin = () => {
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const handleKakaoLogin = useCallback(async () => {
    try {
      console.log('[카카오 로그인 시도]');
      navigation.navigate('ProfileSetup', {});
      // 더미 토큰 사용
      const kakaoToken = 'dummy_token';
      const response = await loginWithKakao(kakaoToken);

      // 구조 분해와 타입 단언
      const { token, user } = (response ?? {}) as {
        token?: string;
        user?: { nickname?: string };
      };

      console.log('응답:', response);

      if (token && user?.nickname) {
        await AsyncStorage.setItem('accessToken', token);
        Alert.alert('로그인 성공!', `${user.nickname}님 환영합니다 🎉`);
        

      } else {
        console.warn('토큰 없음:', response);
        Alert.alert('로그인 실패', '응답에 토큰이나 닉네임이 없습니다.');
      }

    } catch (error) {
      console.error('카카오 로그인 에러', error);
      Alert.alert('로그인 실패', '네트워크나 서버를 확인해주세요.');
    }
  }, [navigation]);

  return { handleKakaoLogin };
};
