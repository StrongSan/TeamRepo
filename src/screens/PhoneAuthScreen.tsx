// src/screens/PhoneAuthScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackHeader from '../components/BackHeader';
import { sendOtp, verifyOtp } from '../api/authAPI';
import { TokenManager } from '../utils/tokenManager';

type PhoneAuthRouteProp = RouteProp<RootStackParamList, 'PhoneAuth'>;

export default function PhoneAuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<PhoneAuthRouteProp>();
  const { userId, kakaoId, nickname, profileImg } = route.params;

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const [sent, setSent] = useState(false);          // 전송됨
  const [verified, setVerified] = useState(false);  // 인증 성공
  const [errorMsg, setErrorMsg] = useState('');     // 실패 메시지
  const [loading, setLoading] = useState(false);    // 로딩 상태

  // 타이머
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!sent || sec <= 0 || verified) return;
    const t = setInterval(() => setSec(v => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [sent, sec, verified]);

  const timerText = useMemo(() => `00:${String(sec).padStart(2, '0')}`, [sec]);

  // 전송 클릭
  const handleSend = async () => {
    if (!phone.trim()) {
      setErrorMsg('전화번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(phone.trim());
      setSent(true);
      setVerified(false);
      setErrorMsg('');
      setSec(57);
      setCode('');
      Alert.alert('성공', '인증번호가 전송되었습니다.');
    } catch (error) {
      setErrorMsg('인증번호 전송에 실패했습니다.');
      console.error('OTP 전송 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 인증 확인
  const handleVerify = async () => {
    if (!sent || verified || !code || code.length !== 6) return;
    
    setLoading(true);
    try {
      const result = await verifyOtp(userId, phone.trim(), code);
      
      if (result.verified && result.token) {
        // JWT 토큰 저장 (액세스 토큰 + 리프레시 토큰)
        if (result.refreshToken) {
          await TokenManager.saveTokens(result.token, result.refreshToken);
          console.log('JWT 토큰 쌍 저장 완료');
        } else {
          await TokenManager.saveAccessToken(result.token);
          console.log('JWT 액세스 토큰 저장 완료');
        }
        
        setVerified(true);
        setErrorMsg('');
        Alert.alert('성공', '인증이 완료되었습니다.');
      } else {
        setVerified(false);
        setErrorMsg('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      setVerified(false);
      setErrorMsg('인증 처리 중 오류가 발생했습니다.');
      console.error('OTP 인증 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 재전송
  const handleResend = async () => {
    try {
      setLoading(true);
      await sendOtp(phone.trim());
      setSec(57);
      setErrorMsg('');
      setCode('');
      Alert.alert('성공', '인증번호가 재전송되었습니다.');
    } catch (error) {
      setErrorMsg('인증번호 재전송에 실패했습니다.');
      console.error('OTP 재전송 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 다음으로
  const handleNext = () => {
    if (!verified) return;
    navigation.navigate('ProfileSetup', {
      kakaoId,
      nickname,
      profileImg,
    });
  };

  // 흰색 확인 버튼 핸들러
  const handleSmallVerify = async () => {
    if (!code || code.length !== 6) {
      setErrorMsg('6자리 인증번호를 입력하세요.');
      return;
    }
    
    // handleVerify 함수 재사용
    await handleVerify();
  };


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.container}>
        <View style={{ height: 24 }} />

         <BackHeader title="전화번호 인증" onBack={() => navigation.goBack()} />

        <Text style={s.sub}>확인 코드를 받을 전화번호를 입력하세요.</Text>

        {/* 전화번호 입력 */}
        <TextInput
          style={s.input}
          placeholder="전화번호 입력"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!sent || !verified}
        />

        {/* 전송 전: 전송 버튼만 노출 */}
        {!sent && (
          <TouchableOpacity style={[s.primaryBtn, { marginTop: 12 }]} onPress={handleSend} activeOpacity={0.9}>
            <Text style={s.primaryTxt}>인증번호 전송</Text>
          </TouchableOpacity>
        )}

        {/* 전송 후: 인증번호 입력 + 타이머 배지 + 큰 확인 버튼 */}
        {sent && (
          <>
            <View style={s.codeRow}>
              <TextInput
                style={[s.input, { flex: 1, marginBottom: 0 }]}
                placeholder="인증번호 입력"
                keyboardType="number-pad"
                value={code}
                onChangeText={(t) => setCode(t.replace(/\D/g, ''))}
                editable={!verified}
              />

              {/* 타이머 + 흰색 확인 버튼을 하나의 캡슐로 */}
              <View style={s.timerGroup}>
                <Text style={s.timerText}>{sec > 0 ? timerText : '00:00'}</Text>
                <TouchableOpacity
                  onPress={handleSmallVerify}
                  disabled={!code || code.length < 4 || verified}
                  activeOpacity={0.9}
                  style={[
                    s.smallWhiteBtn,
                    (!code || code.length < 4 || verified) && { opacity: 0.5 },
                  ]}
                >
                  <Text style={s.smallWhiteTxt}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 실패 메시지 */}
            {!verified && !!errorMsg && <Text style={s.errorText}>{errorMsg}</Text>}

            {/* 성공 메시지 */}
            {verified && <Text style={s.successText}>✓ 인증되었습니다.</Text>}

            {/* 실패 시 재전송 버튼 */}
            {!!errorMsg && !verified && (
              <TouchableOpacity style={{ marginTop: 16 }} onPress={handleResend}>
                <Text style={s.resendText}>인증번호 재전송</Text>
              </TouchableOpacity>
            )}

            {/* 큰 확인 버튼: 전송 후에만 보이고, 성공 시에만 다음 단계로 */}
            {!verified ? (
              <TouchableOpacity
                style={[s.primaryBtn, { marginTop: 16 }, (!code || code.length < 4) && { opacity: 0.5 }]}
                onPress={handleVerify}
                disabled={!code || code.length < 4}
                activeOpacity={0.9}
              >
                <Text style={s.primaryTxt}>확인</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[s.primaryBtn, { marginTop: 16 }]}
                onPress={handleNext}
                activeOpacity={0.9}
              >
                <Text style={s.primaryTxt}>확인</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 18, 
    maxWidth: 390, paddingTop: 15, paddingBottom: 46 },
  title: { fontSize: 28, fontWeight: '800', marginTop: 8 },
  sub: { color: '#666', marginTop: 8, marginBottom: 16 },

  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#ECECEC',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },

  // 전송 후 레이아웃: 입력 + 타이머 배지 분리
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },

  timerBadge: {
    height: 52,
    minWidth: 84,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#ECECEC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  timerText: { color: '#777', fontWeight: '600' },

  primaryBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#E78182',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },

  errorText: { color: '#E35B5B', marginTop: 8, fontSize: 13, fontWeight: '600' },
  successText: { color: '#1BAF5D', marginTop: 8, fontSize: 13, fontWeight: '600' },

  resendText: { color: '#8A8A8A' },

  // 타이머 + 흰색 확인을 감싸는 캡슐
  timerGroup: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 12,
    paddingRight: 8,            // 안쪽 흰버튼 여백
    borderWidth: 1.5,
    borderColor: '#ECECEC',
    borderRadius: 12,
    backgroundColor: '#F7F7F7', // 살짝 톤 차이
  },
  smallWhiteBtn: {
    height: 36,
    minWidth: 56,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },

  smallWhiteTxt: { color: '#666', fontWeight: '700' },


});

