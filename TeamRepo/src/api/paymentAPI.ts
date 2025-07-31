import apiClient from "./apiClient";

export const submitPayment = async (paymentData: {
  userId: number;
  postId: number;
  price: string;
  paymentMethod: string;
  orderDate: string;
}) => {
  const response = await apiClient.post("/api/payment", paymentData);
  return response.data;
};
