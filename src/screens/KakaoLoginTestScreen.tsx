import React from 'react';
import { View, Button, Alert } from 'react-native';
import { useKakaoLogin } from '../hooks/useKakaoLogin';

const KakaoLoginTestScreen = () => {
  const { handleKakaoLogin } = useKakaoLogin();

  const handleLogin = async () => {
    console.log('🟡 [카카오 로그인] 시작');
    try {
      await handleKakaoLogin();
      console.log('✅ 카카오 로그인 완료');
    } catch (error) {
      console.error('❌ 카카오 로그인 실패:', error);
      Alert.alert('로그인 실패', '카카오 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      Alert.alert('로그아웃', '로그아웃 기능은 아직 구현되지 않았습니다.');
    } catch (err) {
      Alert.alert('로그아웃 실패', (err as Error).message);
    }
  };

  return (
    <View style={{ marginTop: 100 }}>
      <Button title="카카오 로그인" onPress={handleLogin} />
      <Button title="카카오 로그아웃" onPress={handleLogout} />
    </View>
  );
};

export default KakaoLoginTestScreen;
