import apiClient from './apiClient';

export type ProfileResponse = {
  userId: number;
  nickname?: string;
  favoriteArea?: string;
  userName?: string;
  profileImg?: string;
  userType?: 'seller' | 'customer';
};

export type ProfileUpdateRequest = {
  nickname?: string;
  favoriteArea?: string;
  userName?: string;
};

// 프로필 조회 (서버가 필요 시 마련). 여기서는 PATCH만 존재하므로, 성공 응답 재사용
export const getMyProfile = async (): Promise<ProfileResponse> => {
  const res = await apiClient.get('/api/v1/users/me');
  return res.data as ProfileResponse;
};

export const updateMyProfile = async (payload: ProfileUpdateRequest): Promise<ProfileResponse> => {
  const res = await apiClient.patch('/api/v1/users/me', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data as ProfileResponse;
};

export const updateMyAvatar = async (uri: string): Promise<ProfileResponse> => {
  const form = new FormData();
  const filename = uri.split('/').pop() || 'avatar.jpg';
  form.append('avatar', {
    // @ts-ignore react-native FormData 타입
    uri,
    name: filename,
    type: 'image/jpeg',
  });
  const res = await apiClient.patch('/api/v1/users/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data as ProfileResponse;
};

export const deleteMyAccount = async (): Promise<void> => {
  await apiClient.delete('/api/users/me');
};


