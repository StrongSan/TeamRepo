import { Platform } from "react-native";
import axios from "axios";
import apiClient from "./apiClient";
import { BASE_URL, AI_SERVER_URL } from "./config";

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

export type Post = {
  postId: number;
  title: string;
  imageUrl: string;
  price: string;
  description: string;
  variantId: number;
  sheetId: number;
  fillingId: number;
  sizeId: number;
  typeId: number;
};

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

  const response = await axios.post(`${BASE_URL}/api/cake-posts`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const fetchAllPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get("/api/cake-posts");
  return response.data.map((item: any) => ({
    ...item,
    postId: item.postId ?? item.id,
  }));
};

// ✅ postAPI.ts 수정
export const fetchRecommendedPostsByUserId = async (
  userId: number
): Promise<Post[]> => {
  const response = await apiClient.get(`/api/recommendation/${userId}`);
  return response.data.map((item: any) => ({
    postId: item.postId ?? item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    price: item.price,
    description: item.description,
    variantId: item.variantId,
    sheetId: item.sheetId,
    fillingId: item.fillingId,
    sizeId: item.sizeId,
    typeId: item.typeId,
  }));
};




export const fetchPostsByCakeIds = async (
  cakeIds: number[]
): Promise<Post[]> => {
  const response = await apiClient.post("/api/cake-posts/by-cake-ids", cakeIds);
  return response.data;
};

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

export const fetchPostById = async (postId: number): Promise<Post> => {
  const response = await apiClient.get(`/api/cake-posts/${postId}`);
  return response.data;
};

export const saveViewedCake = async (userId: number, cakeId: number) => {
  try {
    await apiClient.post("/api/viewed-cake", {
      userId,
      cakeId,
    });
  } catch (error) {
    console.error("조회 기록 저장 실패:", error);
  }
};
