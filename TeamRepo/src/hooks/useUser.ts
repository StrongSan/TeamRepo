// hooks/useUser.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "user";

interface StoredUser {
  userId: number;
  nickname: string;
  userType: "seller" | "customer";
}

// 유저 정보 전체 저장
export const saveUser = async (user: StoredUser) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

// 유저 정보 가져오기
export const getUser = async (): Promise<StoredUser | null> => {
  const userStr = await AsyncStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// userId만 가져오기
export const getUserId = async (): Promise<number | null> => {
  const user = await getUser();
  return user?.userId ?? null;
};

// 유저 정보 제거 (로그아웃 시 사용)
export const removeUser = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};


export const useUser = () => {
  return {
    saveUser,
    getUser,
    getUserId,
    removeUser,
  };
};

