// src/api/apiClient.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './authAPI';

const apiClient = axios.create({
  baseURL: 'http://172.30.176.1:8080', // Android 에뮬레이터에서 로컬 서버 접근용
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// 요청 인터셉터 - 모든 요청에 토큰 자동 추가
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('❌ 토큰 조회 실패:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 시 자동 토큰 갱신
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 이미 재시도한 요청이 아닌 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // 이미 토큰 갱신 중인 경우, 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 401 에러 감지, 토큰 갱신 시도...');
        
        // 토큰 갱신
        const { accessToken } = await refreshToken();
        
        // 대기 중인 요청들 처리
        processQueue(null, accessToken);
        
        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ 토큰 갱신 실패:', refreshError);
        
        // 대기 중인 요청들 모두 실패 처리
        processQueue(refreshError, null);
        
        // 로그인 화면으로 리다이렉트 (필요시)
        // navigation.navigate('Login');
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
