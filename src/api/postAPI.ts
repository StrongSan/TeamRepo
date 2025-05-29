import { Platform } from "react-native";
import axios from "axios";
import apiClient from "../api/apiClient";
import { BASE_URL, AI_SERVER_URL } from "../api/config"; // ✅ 주소 상수 import

// 게시글 등록 시 사용하는 payload 타입
export interface PostPayload {
  title: string;
  description: string;
  price: string;
  variantId: number;
  image: {
    uri: string;
    type: string;
    name: string;
  };
}

// 게시글 타입 정의
export interface Post {
  postId: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  cakeId: number;
}

// ✅ 게시글 등록 (multipart/form-data)
export const submitPostForm = async (data: PostPayload) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("variantId", String(data.variantId));
  formData.append("image", {
    uri: Platform.OS === "ios" ? data.image.uri.replace("file://", "") : data.image.uri,
    type: data.image.type,
    name: data.image.name,
  } as any);

  for (const pair of (formData as any)._parts) {
    console.log("🧾 FormData:", pair[0], pair[1]);
  }

  const response = await axios.post(`${BASE_URL}/api/cake-posts`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ✅ 전체 게시글 불러오기
export const fetchAllPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get("/api/cake-posts");
  return response.data;
};

// ✅ 추천 Cake ID 리스트 가져오기 (FastAPI)
export const fetchRecommendedCakeIds = async (): Promise<number[]> => {
  const response = await axios.get(`${AI_SERVER_URL}/api/recommendation`);
  return response.data;
};

// ✅ 추천 Cake ID 기반 게시글 불러오기
export const fetchPostsByCakeIds = async (cakeIds: number[]): Promise<Post[]> => {
  const response = await apiClient.post("/api/cake-posts/by-cake-ids", cakeIds);
  return response.data;
};

// ✅ variantId 조회 API
export const resolveVariantId = async (
  sheetId: number,
  fillingId: number,
  sizeId: number,
  typeId: number
): Promise<number | null> => {
  try {
    const response = await apiClient.post("/api/variants/resolve", {
      sheetId,
      fillingId,
      sizeId,
      typeId,
    });
    return response.data.variantId;
    
  } catch (error) {
    console.error("variantId 조회 실패:", error);
    return null;
  }
};
