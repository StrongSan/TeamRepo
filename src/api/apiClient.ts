// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:8080', // Android 에뮬레이터에서 로컬 서버 접근용
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
