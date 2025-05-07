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

4/21 
- 수정 코드 -
TitleSection -> CakedaY 로고 화면 길이 조정
PrimaryButton
SellerWriting
-> PrimaryButton이 style props를 받고 있지 않아 스타일 적용이 안되는 부분 수정
MainScreen 임시 사진 입력

5/6
1. productDetailScreen 버튼 네비게이터
  - 사장 -> 수정하기 | 삭제하기
  - 손님 -> 문의하기 | 주문하기
  - seller | customer
2. sellerWriting 글 작성 TopBar 겹치는 부분 수정
  - SafeAreaView를 쓰고 있다면
  - TopBar의 paddingTop: StatusBar.currentHeight는 삭제
3. home-icon 색 수정
4. ProfileScreen TopBar 수정
  - Button Navigator 
    - 사장 -> 내 팔로워 | 프로필 수정 
    - 손님 -> (if 팔로우중 == 팔로잉) | 메세지
              (if 팔로우x == 팔로우) | 메세지

5/7 
1. CakeOrderForm TopBar Props에 styles 추가
  -> 다른 곳에서 임시 스타일 적용 가능
2. CakeOrderForm DropDown 설정
  - CakeTypeChips 제거 (UI 복잡) //나중에 쓸 일이 있겠지~
3. sellerWriting UI 수정 ( 케이트 타입, 사이즈, 필링, 시트 추가 )
4. 태그 추가
  사이즈  -  도시락, 미니, 1호, 2호, 3호
  필링  - 초코, 오레오, 생크림, 딸기생크림, 크림치즈 (ok)
  시트 - 초코,  바닐라
  타입 - 레터링, 유아, 떡, 포토, 이벤트, 과일
5. 글 작성 UI 수정 -> 가독성 좋게


--예정--
7. datePicker, TimePicker 추가
8. 손님 하단 바 변경 
  - 검색 메세지 홈 찜 내프로필
  -> 찜 메세지 내프로필 설정
9. ... 누르면 손님 -> 손님 마이페이지
            사장님 -> 사장님 마이페이지
손님: 프로필 수정, 설정, 내 리뷰, 마이 예약
사장님: 프로필 수정, 설정, 주문내역, 내 가게 리뷰, 마이 예약
10. 손님것도 profile 네비게이터 추가