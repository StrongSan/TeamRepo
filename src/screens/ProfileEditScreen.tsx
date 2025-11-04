import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { updateMyProfile, updateMyAvatar, getMyProfile } from '../api/userAPI';
import ProfileAvatar from '../components/ProfileAvatar';
import { BASE_URL } from '../api/config';

type RouteP = RouteProp<RootStackParamList, 'ProfileEdit'>;

const ProfileEditScreen: React.FC = () => {
  const route = useRoute<RouteP>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userId, userType } = route.params;

  const [nickname, setNickname] = useState('');
  const [favoriteArea, setFavoriteArea] = useState('');
  const [userName, setUserName] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [originalAvatarUri, setOriginalAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 현재 프로필 정보 로드
  useEffect(() => {
    const loadProfile = async () => {
      try {
        console.log('ProfileEditScreen: 프로필 정보 로드 시작...');
        const profile = await getMyProfile();
        console.log('ProfileEditScreen: 프로필 정보 로드 완료:', JSON.stringify(profile, null, 2));
        
        setNickname(profile.nickname || '');
        setFavoriteArea(profile.favoriteArea || '');
        setUserName(profile.userName || '');
        
        // 프로필 사진 URL 설정 (백엔드 경로를 완전한 URL로 변환)
        console.log('ProfileEditScreen: 프로필 사진 처리 시작:', {
          profileImg: profile.profileImg,
          BASE_URL: BASE_URL
        });
        
        if (profile.profileImg) {
          let finalImageUrl: string;
          
          // 이미 완전한 URL인 경우
          if (profile.profileImg.startsWith('http')) {
            console.log('ProfileEditScreen: 완전한 URL 감지, IP 주소 교체 시작');
            // 잘못된 IP 주소가 포함된 경우 BASE_URL로 교체
            if (BASE_URL) {
              try {
                const urlObj = new URL(profile.profileImg);
                const correctBaseUrl = new URL(BASE_URL);
                // 경로만 추출해서 올바른 BASE_URL과 결합
                finalImageUrl = `${correctBaseUrl.origin}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
                console.log('ProfileEditScreen: URL IP 주소 교체 완료:', {
                  original: profile.profileImg,
                  corrected: finalImageUrl,
                  baseUrl: BASE_URL,
                  extractedPath: urlObj.pathname
                });
              } catch (urlError) {
                console.error('ProfileEditScreen: URL 파싱 실패:', urlError);
                // URL 파싱 실패 시 원본 사용하지 않고 경로로 재시도
                const path = profile.profileImg.replace(/^https?:\/\/[^/]+/, '');
                finalImageUrl = `${BASE_URL}${path}`;
                console.log('ProfileEditScreen: 경로 추출 후 재구성:', finalImageUrl);
              }
            } else {
              console.warn('ProfileEditScreen: BASE_URL이 없어 원본 URL 사용');
              finalImageUrl = profile.profileImg;
            }
          } else {
            // 경로가 /로 시작하지 않으면 추가
            const path = profile.profileImg.startsWith('/') ? profile.profileImg : `/${profile.profileImg}`;
            finalImageUrl = `${BASE_URL}${path}`;
            console.log('ProfileEditScreen: 프로필 사진 URL 변환:', {
              original: profile.profileImg,
              path: path,
              baseUrl: BASE_URL,
              fullUrl: finalImageUrl
            });
          }
          
          console.log('ProfileEditScreen: 최종 프로필 사진 URL 설정:', finalImageUrl);
          setAvatarUri(finalImageUrl);
          setOriginalAvatarUri(finalImageUrl);
        } else {
          // 프로필 사진이 없는 경우
          console.log('ProfileEditScreen: 프로필 사진 없음');
          setAvatarUri(null);
          setOriginalAvatarUri(null);
        }
      } catch (error) {
        console.error('ProfileEditScreen: 프로필 로드 실패:', error);
        Alert.alert('오류', '프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onSave = async () => {
    try {
      setSaving(true);
      
      // 프로필 정보 업데이트
      await updateMyProfile({ 
        nickname: nickname || undefined, 
        favoriteArea: favoriteArea || undefined, 
        userName: userName || undefined 
      });
      
      // 프로필 사진이 변경되었으면 업로드
      if (avatarUri && avatarUri !== originalAvatarUri) {
        // 로컬 파일 URI인 경우에만 업로드 (http로 시작하지 않으면 로컬 파일)
        if (!avatarUri.startsWith('http')) {
          await updateMyAvatar(avatarUri);
        }
      }
      
      Alert.alert('완료', '프로필이 저장되었습니다.');
      navigation.goBack();
    } catch (e: any) {
      console.error('프로필 저장 실패:', e);
      Alert.alert('오류', '프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>프로필 수정</Text>
      
      {/* 프로필 사진 */}
      <ProfileAvatar imageUri={avatarUri} onChangeImage={setAvatarUri} />
      
      <View style={styles.field}> 
        <Text style={styles.label}>닉네임</Text>
        <TextInput value={nickname} onChangeText={setNickname} placeholder="닉네임" style={styles.input} />
      </View>
      <View style={styles.field}> 
        <Text style={styles.label}>선호 지역</Text>
        <TextInput value={favoriteArea} onChangeText={setFavoriteArea} placeholder="예: 청주" style={styles.input} />
      </View>
      <View style={styles.field}> 
        <Text style={styles.label}>이름</Text>
        <TextInput value={userName} onChangeText={setUserName} placeholder="이름" style={styles.input} />
      </View>

      <TouchableOpacity style={[styles.button, saving && { opacity: 0.7 }]} onPress={onSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? '저장 중...' : '저장'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { 
    paddingHorizontal: 20, 
    paddingVertical: 24,
    gap: 24,
    alignItems: 'center', // 컨텐츠 중앙 정렬
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#222',
    alignSelf: 'flex-start', // 제목은 좌측 정렬
    marginBottom: 8,
  },
  field: { 
    gap: 8,
    width: '100%', // 전체 너비 사용
    maxWidth: 400, // 최대 너비 제한 (중앙 정렬 유지)
  },
  label: { 
    fontSize: 13, 
    color: '#666',
    marginBottom: 4,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    width: '100%', // 전체 너비 사용
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E78182',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%', // 전체 너비 사용
    maxWidth: 400, // 최대 너비 제한
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileEditScreen;


