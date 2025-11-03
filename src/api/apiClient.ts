import axios, { AxiosResponse } from 'axios';
import { refreshToken } from './authAPI';
import { TokenManager } from '../utils/tokenManager';
import { normalizeError } from '../utils/normalizeError';

const apiClient = axios.create({
  baseURL: 'http://192.168.219.101:8080', 
  timeout: 10000, // 10초 타임아웃
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
      const token = await TokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('토큰 조회 실패:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(normalizeError(error));
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
      const url: string = originalRequest?.url || '';
      // 토큰/공개 엔드포인트에서는 갱신 루프 금지
      if (
        url.includes('/auth/refresh') ||
        url.includes('/auth/verify') ||
        url.includes('/auth/logout') ||
        url.includes('/otp/') ||
        url.includes('/api/users/kakao/')
      ) {
        return Promise.reject(error);
      }
      
      // 이미 토큰 갱신 중인 경우, 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(normalizeError(err));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰 갱신
        const { accessToken } = await refreshToken();
        
        // 대기 중인 요청들 처리
        processQueue(null, accessToken);
        
        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        
        // 대기 중인 요청들 모두 실패 처리
        processQueue(refreshError, null);
        
        // 로그인 화면으로 리다이렉트 (필요시)
        // navigation.navigate('Login');
        
        return Promise.reject(normalizeError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

export default apiClient;
