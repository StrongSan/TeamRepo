// src/api/fetchPostsByCakeIds.ts
import axios from "axios";
import { AI_SERVER_URL } from "./config";
import type { Post } from "./postAPI";

export const fetchPostsByCakeIds = async (variantIds: number[]): Promise<Post[]> => {
  try {
    const response = await axios.post(`${AI_SERVER_URL}/posts/by-variants`, {
      variant_ids: variantIds,
    });
    return response.data; // 응답이 Post[] 배열이라고 가정
  } catch (error) {
    console.error("추천 게시글 상세 조회 실패", error);
    return [];
  }
};
