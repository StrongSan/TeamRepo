import { NativeModules, NativeEventEmitter } from 'react-native';

const { KakaoLoginModule } = NativeModules;

export interface KakaoToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  refreshTokenExpiresAt: number;
  scopes: string[];
}

export interface KakaoProfile {
  id: string;
  nickname?: string;
  email?: string;
  profileImage?: string;
  thumbnailImage?: string;
}

export interface KakaoAccessTokenInfo {
  accessToken: string;
  expiresAt: number;
}

class KakaoNativeLogin {
  private eventEmitter: NativeEventEmitter;

  constructor() {
    this.eventEmitter = new NativeEventEmitter(KakaoLoginModule);
  }

  /**
   * 카카오 로그인
   */
  async login(): Promise<KakaoToken> {
    try {
      console.log('🟡 [네이티브 카카오 로그인] 시작');
      const result = await KakaoLoginModule.login();
      console.log('✅ [네이티브 카카오 로그인] 성공');
      return result;
    } catch (error) {
      console.error('❌ [네이티브 카카오 로그인] 실패:', error);
      throw error;
    }
  }

  /**
   * 카카오 로그아웃
   */
  async logout(): Promise<string> {
    try {
      const result = await KakaoLoginModule.logout();
      console.log('✅ [네이티브 카카오 로그아웃] 성공');
      return result;
    } catch (error) {
      console.error('❌ [네이티브 카카오 로그아웃] 실패:', error);
      throw error;
    }
  }

  /**
   * 액세스 토큰 정보 조회
   */
  async getAccessToken(): Promise<KakaoAccessTokenInfo> {
    try {
      const result = await KakaoLoginModule.getAccessToken();
      console.log('✅ [네이티브 액세스 토큰] 조회 성공');
      return result;
    } catch (error) {
      console.error('❌ [네이티브 액세스 토큰] 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 사용자 프로필 조회
   */
  async getProfile(): Promise<KakaoProfile> {
    try {
      const result = await KakaoLoginModule.getProfile();
      console.log('✅ [네이티브 프로필] 조회 성공');
      return result;
    } catch (error) {
      console.error('❌ [네이티브 프로필] 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 로그인 상태 확인
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const result = await KakaoLoginModule.isLoggedIn();
      console.log('✅ [네이티브 로그인 상태] 확인:', result);
      return result;
    } catch (error) {
      console.error('❌ [네이티브 로그인 상태] 확인 실패:', error);
      return false;
    }
  }

  /**
   * 이벤트 리스너 추가
   */
  addEventListener(eventName: string, listener: (data: any) => void) {
    return this.eventEmitter.addListener(eventName, listener);
  }

  /**
   * 이벤트 리스너 제거
   */
  removeEventListener(eventName: string, listener: (data: any) => void) {
    this.eventEmitter.removeListener(eventName, listener);
  }
}

export default new KakaoNativeLogin(); 