import apiClient from "./apiClient";
import { TokenManager } from "../utils/tokenManager";

// 찜 추가
export const addFavorite = async (userId: string, cakeId: number) => {
  try {
    const token = await TokenManager.getAccessToken();
    const response = await apiClient.post("/favorites", null, {
      params: { cakeId },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("[찜 추가 실패]", error);
    throw error;
  }
};

// 찜 제거
export const removeFavorite = async (userId: string, cakeId: number) => {
  try {
    const token = await TokenManager.getAccessToken();
    const response = await apiClient.delete("/favorites", {
      params: { cakeId },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("[찜 제거 실패]", error);
    throw error;
  }
};

// 찜 토글
export const toggleFavorite = async (userId: string, cakeId: number) => {
  try {
    const token = await TokenManager.getAccessToken();
    const response = await apiClient.post("/favorites/toggle", null, {
      params: { cakeId },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("[찜 토글 실패]", error);
    throw error;
  }
};

// 찜 여부 확인
export const checkFavorite = async (userId: string, cakeId: number) => {
  try {
    const token = await TokenManager.getAccessToken();
    const response = await apiClient.get("/favorites/check", {
      params: { cakeId },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("[찜 확인 실패]", error);
    throw error;
  }
};

// 찜 목록 조회
export const getFavoriteList = async (userId: string, page: number = 0, size: number = 20) => {
  try {
    const token = await TokenManager.getAccessToken();
    const response = await apiClient.get("/favorites", {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("[찜 목록 조회 실패]", error);
    throw error;
  }
};

// 찜 개수 조회
export const getFavoriteCount = async (cakeId: number) => {
  try {
    const token = await TokenManager.getAccessToken();
    const response = await apiClient.get("/favorites/count", {
      params: { cakeId },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("[찜 개수 조회 실패]", error);
    throw error;
  }
};
