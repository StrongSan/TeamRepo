import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class TokenManager {
  /**
   * 액세스 토큰과 리프레시 토큰을 저장
   */
  static async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      ]);
      console.log('✅ 토큰 저장 완료');
    } catch (error) {
      console.error('❌ 토큰 저장 실패:', error);
      throw error;
    }
  }

  /**
   * 액세스 토큰만 저장 (기존 호환성 유지)
   */
  static async saveAccessToken(accessToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      console.log('✅ 액세스 토큰 저장 완료');
    } catch (error) {
      console.error('❌ 액세스 토큰 저장 실패:', error);
      throw error;
    }
  }

  /**
   * 액세스 토큰 조회
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('❌ 액세스 토큰 조회 실패:', error);
      return null;
    }
  }

  /**
   * 리프레시 토큰 조회
   */
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('❌ 리프레시 토큰 조회 실패:', error);
      return null;
    }
  }

  /**
   * 토큰 쌍 조회
   */
  static async getTokens(): Promise<TokenPair | null> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(ACCESS_TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY)
      ]);

      if (accessToken && refreshToken) {
        return { accessToken, refreshToken };
      }
      return null;
    } catch (error) {
      console.error('❌ 토큰 조회 실패:', error);
      return null;
    }
  }

  /**
   * 모든 토큰 삭제 (로그아웃 시)
   */
  static async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY)
      ]);
      console.log('✅ 토큰 삭제 완료');
    } catch (error) {
      console.error('❌ 토큰 삭제 실패:', error);
      throw error;
    }
  }

  /**
   * 토큰 존재 여부 확인
   */
  static async hasTokens(): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      return tokens !== null;
    } catch (error) {
      console.error('❌ 토큰 존재 확인 실패:', error);
      return false;
    }
  }
}
