// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://172.30.1.14:8080', // ✅ 이 주소만 수정하면 전체 적용됨
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
