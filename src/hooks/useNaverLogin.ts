import { useCallback } from 'react';
import { Alert } from 'react-native';
import { loginWithNaver } from '../api/authAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export const useNaverLogin = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNaverLogin = useCallback(async () => {
    try {
      console.log('[네이버 로그인 시도]');
      navigation.navigate('ProfileSetup', {}); // 일단 더미로 이동
      const naverToken = 'dummy_naver_token';

      const response = await loginWithNaver(naverToken);

      const { token, user } = (response ?? {}) as {
        token?: string;
        user?: { nickname?: string };
      };

      console.log('응답:', response);

      if (token && user?.nickname) {
        await AsyncStorage.setItem('accessToken', token);
        Alert.alert('로그인 성공!', `${user.nickname}님 환영합니다`);
        // 필요시 navigation.navigate('Home') 등 이동 가능
      } else {
        console.warn('토큰 없음:', response);
        Alert.alert('로그인 실패', '응답에 토큰이나 닉네임이 없습니다.');
      }

    } catch (error) {
      console.error('네이버 로그인 에러', error);
      Alert.alert('로그인 실패', '네트워크나 서버를 확인해주세요.');
    }
  }, [navigation]);

  return { handleNaverLogin };
};
