import axios from 'axios';
import { Platform } from 'react-native';

export interface PostPayload {
  title: string;
  description: string;
  price: string;
  cakeTypes: string[];
  image: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface Post {
  postId: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  cakeId: number; // ✅ 추가: cakeId도 포함
}

// 게시글 등록
export const submitPostForm = async (data: PostPayload) => {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('price', data.price);
  formData.append('cakeTypes', JSON.stringify(data.cakeTypes));
  formData.append('image', {
    uri: Platform.OS === 'ios' ? data.image.uri.replace('file://', '') : data.image.uri,
    type: data.image.type,
    name: data.image.name,
  } as any);

  const response = await axios.post('http://172.24.5.225:8080/api/cake-posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// ✅ 게시글 전체 불러오기 (처음 진입 시)
export const fetchAllPosts = async () => {
  const response = await axios.get('http://172.24.5.225:8080/api/cake-posts');
  return response.data;
};

// ✅ 추천 cakeId 리스트 가져오기
export const fetchRecommendedCakeIds = async (): Promise<number[]> => {
  const response = await axios.get('http://172.24.5.225:8080/api/recommendations');
  return response.data; // 예: [1, 7, 13]
};

// ✅ 추천 cakeId 기반으로 게시글 정보 가져오기
export const fetchPostsByCakeIds = async (cakeIds: number[]): Promise<Post[]> => {
  const response = await axios.post(
    'http://172.24.5.225:8080/api/cake-posts/by-cake-ids',
    cakeIds
  );
  return response.data;
};
