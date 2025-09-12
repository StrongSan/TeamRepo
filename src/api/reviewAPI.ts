import apiClient from './apiClient';

export interface ReviewCreateRequest {
  userId: number;
  cakeId: number;
  rating: number; // 1.0 ~ 5.0
  comment?: string; // 최대 1000자
}

export interface ReviewUpdateRequest {
  userId: number;
  rating?: number; // 1.0 ~ 5.0
  comment?: string; // 최대 1000자
}

export interface ReviewResponse {
  reviewId: number;
  userId: number;
  cakeId: number;
  shopId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewSummary {
  avgRating: number;
  count: number;
}

export interface ReviewReplyCreateRequest {
  ownerId: number;
  comment: string; // 최대 1000자
}

export interface ReviewReplyUpdateRequest {
  ownerId: number;
  comment: string; // 최대 1000자
}

export interface ReviewReplyResponse {
  replyId: number;
  reviewId: number;
  ownerId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/**
 * 리뷰를 생성합니다
 * @param reviewData 리뷰 생성 데이터
 */
export const createReview = async (reviewData: ReviewCreateRequest): Promise<{ reviewId: number }> => {
  const response = await apiClient.post('/reviews', reviewData);
  return response.data;
};

/**
 * 리뷰를 수정합니다
 * @param reviewId 리뷰 ID
 * @param updateData 리뷰 수정 데이터
 */
export const updateReview = async (
  reviewId: number,
  updateData: ReviewUpdateRequest
): Promise<void> => {
  await apiClient.patch(`/reviews/${reviewId}`, updateData);
};

/**
 * 리뷰를 삭제합니다
 * @param reviewId 리뷰 ID
 * @param userId 사용자 ID
 */
export const deleteReview = async (reviewId: number, userId: number): Promise<void> => {
  await apiClient.delete(`/reviews/${reviewId}?userId=${userId}`);
};

/**
 * 특정 케이크의 리뷰 목록을 조회합니다
 * @param cakeId 케이크 ID
 * @param page 페이지 번호 (기본값: 0)
 * @param size 페이지 크기 (기본값: 10)
 */
export const getReviewsByCake = async (
  cakeId: number,
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<ReviewResponse>> => {
  const response = await apiClient.get(`/reviews/cakes/${cakeId}`, {
    params: { page, size },
  });
  return response.data;
};

/**
 * 특정 상점의 리뷰 목록을 조회합니다
 * @param shopId 상점 ID
 * @param page 페이지 번호 (기본값: 0)
 * @param size 페이지 크기 (기본값: 10)
 */
export const getReviewsByShop = async (
  shopId: number,
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<ReviewResponse>> => {
  const response = await apiClient.get(`/reviews/shops/${shopId}`, {
    params: { page, size },
  });
  return response.data;
};

/**
 * 특정 케이크의 리뷰 요약 정보를 조회합니다 (평균 평점, 리뷰 수)
 * @param cakeId 케이크 ID
 */
export const getReviewSummaryByCake = async (cakeId: number): Promise<ReviewSummary> => {
  const response = await apiClient.get(`/reviews/cakes/${cakeId}/summary`);
  return response.data;
};

/**
 * 리뷰에 답글을 작성합니다 (사장님용)
 * @param reviewId 리뷰 ID
 * @param replyData 답글 생성 데이터
 */
export const createReviewReply = async (
  reviewId: number,
  replyData: ReviewReplyCreateRequest
): Promise<{ replyId: number }> => {
  const response = await apiClient.post(`/reviews/${reviewId}/reply`, replyData);
  return response.data;
};

/**
 * 리뷰 답글을 수정합니다 (사장님용)
 * @param reviewId 리뷰 ID
 * @param replyId 답글 ID
 * @param updateData 답글 수정 데이터
 */
export const updateReviewReply = async (
  reviewId: number,
  replyId: number,
  updateData: ReviewReplyUpdateRequest
): Promise<void> => {
  await apiClient.patch(`/reviews/${reviewId}/reply/${replyId}`, updateData);
};

/**
 * 리뷰 답글을 삭제합니다 (사장님용)
 * @param reviewId 리뷰 ID
 * @param replyId 답글 ID
 * @param ownerId 사장님 ID
 */
export const deleteReviewReply = async (
  reviewId: number,
  replyId: number,
  ownerId: number
): Promise<void> => {
  await apiClient.delete(`/reviews/${reviewId}/reply/${replyId}?ownerId=${ownerId}`);
};

/**
 * 특정 리뷰의 답글을 조회합니다
 * @param reviewId 리뷰 ID
 */
export const getReviewReply = async (reviewId: number): Promise<ReviewReplyResponse | null> => {
  const response = await apiClient.get(`/reviews/${reviewId}/reply`);
  return response.data;
};
