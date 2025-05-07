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
  } as any); // TS 타입 오류 방지

  const response = await axios.post('http://<서버_IP>:8080/api/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
