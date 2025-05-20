import axios from 'axios';

//백엔드 API 주소 - 추후 카카오 도메인으로 변경
const API_BASE_URL = 'http://172.24.5.225:8080';

//카카오 로그인 요청
export const loginWithKakao = async (kakaoAccessToken: String) => {
    try {
        const response = await axios.post('http://172.24.5.225:8080/auth/kakao', {
            token: kakaoAccessToken
          });

        console.log('응답:', response.data); // { nickname, token }

        return response.data; 
    } catch (error) {
        console.error('[카카오 로그인 실패]', error);
        throw error;
    }
};  

// 네이버 로그인 요청이고, api_base_url 부분에 ip 입력해주시면 됩니다.
export const loginWithNaver = async (naverToken: string) => {
  return await axios.post(`${API_BASE_URL}/auth/naver`, {
    token: naverToken,
  });
};