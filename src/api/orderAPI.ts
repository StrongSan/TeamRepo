import apiClient from './apiClient';

export interface OrderItem {
  id: string;
  thumbnail: string;
  title: string;
  pickupDate: string;
  options: string;
  price: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export interface OrderListResponse {
  orders: OrderItem[];
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
}

export interface OrderDetailResponse {
  id: string;
  thumbnail: string;
  title: string;
  pickupDate: string;
  options: string;
  price: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  orderDate: string;
  customerInfo: {
    name: string;
    phone: string;
  };
  cakeInfo: {
    postId: number;
    title: string;
    imageUrl: string;
    description: string;
  };
  orderOptions: {
    variantId: number;
    sheetId: number;
    fillingId: number;
    sizeId: number;
    typeId: number;
  };
}

/**
 * 사용자의 주문 목록을 가져옵니다
 * @param userId 사용자 ID
 * @param status 주문 상태 ('IN_PROGRESS' | 'COMPLETED')
 * @param page 페이지 번호 (기본값: 0)
 * @param size 페이지 크기 (기본값: 10)
 */
export const getOrderList = async (
  userId: string,
  status: 'IN_PROGRESS' | 'COMPLETED',
  page: number = 0,
  size: number = 10
): Promise<OrderListResponse> => {
  const response = await apiClient.get(`/orders/user/${userId}`, {
    params: {
      status,
      page,
      size,
    },
  });
  return response.data;
};

/**
 * 주문 상세 정보를 가져옵니다
 * @param orderId 주문 ID
 */
export const getOrderDetail = async (orderId: string): Promise<OrderDetailResponse> => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data;
};

/**
 * 주문을 취소합니다
 * @param orderId 주문 ID
 */
export const cancelOrder = async (orderId: string): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/cancel`);
};

/**
 * 주문 상태를 업데이트합니다 (판매자용)
 * @param orderId 주문 ID
 * @param status 새로운 상태
 */
export const updateOrderStatus = async (
  orderId: string,
  status: 'IN_PROGRESS' | 'COMPLETED'
): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/status`, { status });
};

/**
 * 주문을 재주문합니다
 * @param orderId 원본 주문 ID
 */
export const reorder = async (orderId: string): Promise<{ postId: number }> => {
  const response = await apiClient.post(`/orders/${orderId}/reorder`);
  return response.data;
};

/**
 * 주문에 대한 문의를 시작합니다
 * @param orderId 주문 ID
 * @param message 문의 메시지
 */
export const startInquiry = async (
  orderId: string,
  message: string
): Promise<{ chatId: string }> => {
  const response = await apiClient.post(`/orders/${orderId}/inquiry`, { message });
  return response.data;
};

/**
 * 주문에 대한 후기를 작성합니다
 * @param orderId 주문 ID
 * @param rating 평점 (1-5)
 * @param content 후기 내용
 */
export const writeReview = async (
  orderId: string,
  rating: number,
  content: string
): Promise<void> => {
  await apiClient.post(`/orders/${orderId}/review`, {
    rating,
    content,
  });
};
