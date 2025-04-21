import axios from 'axios';

//백엔드 API 주소 - 추후 카카오 도메인으로 변경
const API_BASE_URL = 'http://192.168.0.4:8080';

//카카오 로그인 요청
export const loginWithKakao = async (kakaoAccessToken: String) => {
    try {
        const response = await axios.post('http://192.168.0.4:8080/auth/kakao', {
            token: kakaoAccessToken
          });

        console.log('응답:', response.data); // { nickname, token }

        return response.data; 
    } catch (error) {
        console.error('[카카오 로그인 실패]', error);
        throw error;
    }
};  