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

export interface OrderRequestDto {
  userId: number;
  postId: number;
  name: string;
  qty: number;
  pickupDate: string;
  pickupTime: string;
  letteringText: string;
  memo: string;
  pickupName: string;
  imageUrl: string;
  price: number;
  unitPrice: number;
  variantId: number;
  sheetId: number;
  fillingId: number;
  sizeId: number;
  typeId: number;
}

export interface CreateOrderResponse {
  orderId: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  totalPrice: number;
}

/**
 * 주문을 생성합니다
 * @param orderData 주문 데이터
 */
export const createOrder = async (orderData: OrderRequestDto): Promise<CreateOrderResponse> => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

/**
 * 사용자의 주문 목록을 가져옵니다 (v1)
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
 * 사용자의 주문 목록을 가져옵니다 (v2 - 판매자 정보 포함)
 * @param userId 사용자 ID
 * @param status 주문 상태 ('IN_PROGRESS' | 'COMPLETED')
 * @param page 페이지 번호 (기본값: 0)
 * @param size 페이지 크기 (기본값: 10)
 */
export const getOrderListV2 = async (
  userId: string,
  status: 'IN_PROGRESS' | 'COMPLETED',
  page: number = 0,
  size: number = 10
): Promise<any> => {
  const response = await apiClient.get(`/orders/user/${userId}/v2`, {
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
 * @param userId 사용자 ID
 */
export const cancelOrder = async (orderId: string): Promise<void> => {
  await apiClient.delete(`/orders/${orderId}`);
};

/**
 * 주문 상태를 업데이트합니다 (판매자용)
 * @param orderId 주문 ID
 * @param sellerId 판매자 ID
 * @param status 새로운 상태
 */
export const updateOrderStatus = async (
  orderId: string,
  sellerId: string,
  status: 'IN_PROGRESS' | 'COMPLETED'
): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/status`, { status }, {
    params: { sellerId }
  });
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
