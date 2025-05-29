import apiClient from "./apiClient";
import { BASE_URL } from "./config";

// 프로필 등록 요청
export const submitProfile = async (profileData: {
  nickname: string;
  location: string;
  userType: "seller" | "customer";
  selectedCakes: number[];
}) => {
  const response = await apiClient.post("/api/users", profileData);
  return response.data;
};
