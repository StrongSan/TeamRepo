import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ArrowIcon from '../../assets/icons/allowLeft.svg';
import { getMyProfile, type ProfileResponse } from '../api/userAPI';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const ProfileCard: React.FC = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  // 최초 마운트 + 화면 재포커스 시 재조회
  const fetchProfile = useCallback(async () => {
    try {
      console.log('ProfileCard: 프로필 조회 시작...');
      const me = await getMyProfile();
      console.log('ProfileCard: API 응답 데이터:', JSON.stringify(me, null, 2));
      setProfile(me);
    } catch (e) {
      console.error('ProfileCard: 프로필 조회 실패:', e);
      // 실패 시에도 기본값으로 설정하지 않고 null 유지
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  // API 응답에서 실제 값 추출 (더미 데이터 제거)
  const displayName = profile?.nickname || profile?.userName || '사용자';
  const displayArea = profile?.favoriteArea || '';
  const avatarUri = profile?.profileImg;
  
  console.log('ProfileCard: 표시할 데이터:', {
    displayName,
    displayArea, 
    avatarUri,
    hasProfile: !!profile
  });

  // 프로필 이미지 URL 처리 (백엔드 경로를 완전한 URL로 변환)
  const getImageUrl = (uri: string | undefined) => {
    if (!uri) return null;
    if (uri.startsWith('http')) return uri; // 이미 완전한 URL인 경우
    return `http://172.19.208.1:8080${uri}`; // 백엔드 서버 URL 추가
  };

  const fullImageUrl = getImageUrl(avatarUri);

  return (
    <View style={styles.container}>
      {fullImageUrl ? (
        <Image source={{ uri: fullImageUrl }} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatar} />
      )}
      <View style={styles.infoContainer}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{displayName}</Text>
          {!!displayArea && <Text style={styles.location}>{displayArea}</Text>}
        </View>
      </View>
      {/*  프로필 수정하러 가는 화살표표
      <View style={styles.iconContainer}>
        <ArrowIcon width={24} height={24} />
      </View>
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    marginTop: 39,
    width: '100%',
    gap: 16,
    flexDirection: 'row',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 72,
    borderWidth: 1,
    borderColor: 'rgba(145, 149, 142, 0.06)',
    backgroundColor: '#C4C4C4',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 72,
    borderWidth: 1,
    borderColor: 'rgba(145, 149, 142, 0.06)',
  },
  infoContainer: {
    flex: 1,
    gap: 8,
  },
  userInfo: {
    gap: 4,
  },
  username: {
    color: '#363a33',
    fontSize: 17,
    fontFamily: 'Poppins',
    fontWeight: '700',
    letterSpacing: -0.17,
  },
  location: {
    color: '#70756b',
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '500',
    marginTop: 4,
  },
  iconContainer: {
    padding: 20,
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default ProfileCard;