// src/api/config.ts
import apiClient from './apiClient';

// apiClient의 baseURL을 가져와서 사용
export const BASE_URL = apiClient.defaults.baseURL; // apiClient의 baseURL 사용
export const AI_SERVER_URL = "http://172.19.208.1:8000"; // FastAPI
