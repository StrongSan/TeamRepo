// postAPI.ts
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

//게시글 불러오기
export const fetchAllPosts = async () => {
  const response = await axios.get('http://172.24.5.225:8080/api/cake-posts');
  return response.data;
};
