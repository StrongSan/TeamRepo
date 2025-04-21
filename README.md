04.02 화면 설계를 마친 앱 초기버전 a1.0 클론 업로드
04.02 a1.0 설계를 토대로 API와 Navigation 기능 추가 -> a1.1

-a1.1 업데이트 항목[04.02]
hooks       -   useKakaoLogin.ts 추가
api         -   authAPI.ts 추가
Navigation  -   AppNavigator.tsx 추가

LoginScreen 업데이트
- 상단 훅 import 추가
- 카카오버튼 작동방식 변경
import { useKakaoLogin } from '../hooks/useKakaoLogin'; 
 <KakaoButton onPress={handleKakaoLogin} />            
 
APP.tsx 업데이트
-네비게이션 추가로 전체적인 구조 변경
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
