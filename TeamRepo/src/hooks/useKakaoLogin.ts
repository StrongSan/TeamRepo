import { useCallback } from 'react';
import { Alert } from 'react-native';
import { loginWithKakao } from '../api/authAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { saveUser } from "../hooks/useUser"; 
import { useUser } from './useUser'; // 또는 '../hooks/useUser'; (상대 경로 정확히 확인)




export const useKakaoLogin = () => {

  const { saveUser } = useUser(); 
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const handleKakaoLogin = useCallback(async () => {
    try {
      console.log('[카카오 로그인 시도]');
      navigation.navigate('ProfileSetup', {});
      const kakaoToken = 'dummy_token';
      const response = await loginWithKakao(kakaoToken);

      const { token, user } = (response ?? {}) as {
        token?: string;
        user?: { nickname?: string };
      };

      console.log('응답:', response);

      if (token && user?.nickname) {
        await AsyncStorage.setItem("accessToken", token);
        await saveUser(user); // ✅ user 정보 전체 저장 (userId 포함)

        Alert.alert("로그인 성공!", `${user.nickname}님 환영합니다 🎉`);
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
