// src/api/fetchRecommendedCakeIds.ts
import axios from "axios";
import { AI_SERVER_URL } from "./config";

export const fetchRecommendedCakeIds = async (variantIds: number[]) => {
  const response = await axios.post(`${AI_SERVER_URL}/recommend`, {
    selected_variant_ids: variantIds,
  });
  return response.data.recommended_cakes; // [variantId1, variantId2, ...]
};
