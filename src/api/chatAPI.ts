import apiClient from './apiClient';

// =============== 타입 정의 ===============

export interface ChatRoom {
  roomId: number;
}

export interface ChatMessage {
  msgId: number;
  roomId: number;
  senderId: number;
  content: string;
  contentType: 'TEXT' | 'IMAGE';
  createdAt: string; // ISO 8601
}

export interface ChatPreview {
  id: string;
  name: string;
  lastMessage: string;
  unread?: number;
  roomId: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface EnterRoomResponse {
  latestMsgId: number;
}

export interface ReadSyncResponse {
  lastReadMsgId: number;
}

// =============== REST API 함수들 ===============

/**
 * 상품별 문의하기 - 채팅방 생성 또는 기존 방 조회
 * @param productId 상품 ID
 * @param customerId 고객 ID
 * @returns 채팅방 정보
 */
export const createOrGetChatRoom = async (productId: number, customerId: number): Promise<{
  roomId: number;
  sellerId: number;
  customerId: number;
  isNewRoom: boolean;
  messageCount: number;
  productId: number;
}> => {
  const response = await apiClient.post(`/api/chat/inquiry/${productId}?customerId=${customerId}`);
  return response.data;
};

/**
 * 최근 30개 메시지 조회
 * @param roomId 채팅방 ID
 * @returns 메시지 목록
 */
export const getRecentMessages = async (roomId: number): Promise<ChatMessage[]> => {
  const response = await apiClient.get(`/api/chat/rooms/${roomId}/recent`);
  return response.data;
};

/**
 * 사용자별 채팅방 목록 조회
 * @param userId 사용자 ID
 * @returns 채팅방 미리보기 목록
 */
export const getChatRooms = async (userId: number): Promise<{
  roomId: number;
  otherUserId: number;
  otherUserNickname: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  lastMessageType: string;
}[]> => {
  const response = await apiClient.get(`/api/chat/rooms/${userId}`);
  return response.data;
};

/**
 * 채팅 이미지 업로드
 * @param imageUri 로컬 이미지 URI
 * @returns 업로드된 이미지 URL
 */
export const uploadChatImage = async (imageUri: string): Promise<string> => {
  const formData = new FormData();
  
  // React Native에서 FormData에 파일 추가
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'image.jpg',
  } as any);

  const response = await apiClient.post('/api/chat/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.data.success) {
    return response.data.imageUrl;
  } else {
    throw new Error(response.data.message || '이미지 업로드 실패');
  }
};

/**
 * 미읽음 메시지 개수 조회
 * @param roomId 채팅방 ID
 * @returns 미읽음 개수
 */
export const getUnreadCount = async (roomId: number): Promise<number> => {
  const response = await apiClient.get<UnreadCountResponse>(`/api/chat/rooms/${roomId}/unread-count`);
  return response.data.unreadCount;
};

/**
 * 채팅방 입장 (읽음 상태 업데이트)
 * @param roomId 채팅방 ID
 * @returns 최신 메시지 ID
 */
export const enterChatRoom = async (roomId: number): Promise<number> => {
  const response = await apiClient.post<EnterRoomResponse>(`/api/chat/rooms/${roomId}/enter`);
  return response.data.latestMsgId;
};

/**
 * 읽음 상태 동기화
 * @param roomId 채팅방 ID
 * @param lastReadMsgId 마지막으로 읽은 메시지 ID
 * @returns 동기화된 메시지 ID
 */
export const syncReadStatus = async (roomId: number, lastReadMsgId: number): Promise<number> => {
  const response = await apiClient.post<ReadSyncResponse>(`/api/chat/rooms/${roomId}/read-sync`, {
    lastReadMsgId,
  });
  return response.data.lastReadMsgId;
};

// =============== WebSocket 관련 타입 ===============

export interface StompMessage {
  type?: 'MESSAGE' | 'READ_RECEIPT';
  msgId?: number;
  roomId?: number;
  senderId?: number;
  content?: string;
  contentType?: 'TEXT' | 'IMAGE';
  createdAt?: string;
  // READ_RECEIPT 필드
  readerId?: number;
  lastReadMsgId?: number;
  atEpochMillis?: number;
}

export interface SendMessageRequest {
  content: string;
  contentType: 'TEXT' | 'IMAGE';
}

