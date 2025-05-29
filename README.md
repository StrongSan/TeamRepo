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

5/7 (2)
1. ProfileSetupScreen 프로필 이미지 추가 기능
  - 추가 후 추가된 이미지로 고정
2. 손님 하단 바 변경 
  - 검색 메세지 홈 찜 내프로필
  -> 찜 메세지 내프로필 설정

5/11 
1. SellerMypage 제작 (export default)
9. ... 누르면 손님 -> 손님 마이페이지
             사장님 -> 사장님 마이페이지
손님: 프로필 수정, 설정, 내 리뷰, 마이 예약
사장님: 프로필 수정, 설정, 주문내역, 내 가게 리뷰, 마이 예약

5/14
1. datePicker, TimePicker 추가
  - 입력 색 수정

5/19
1. 주문하기 창 드롭다운 잘리는 버그 수정
2. productdetailScreen UI 수정 (정사각형, 둥근 모서리)
3. modal창 구현

5/21
1. 앱에 뜨는 자잘한 에러 제거 ( text error , FlatList error )
2. 손님/사장 마이페이지 따로 구현(navigator)
3. 손님 profile 네비게이터 추가(찜, 메세지 제외)

5/25
1. sellerwriting 이미지 업로드 버튼 수정
  - 이미지 1개 업로드 시 조건부 UI 개선
  - 업로드 버튼 가시성 
  - 이미지 위의 x 버튼 누르면 이미지 삭제

5/26
1. cakeorderform  이미지 업로드 버튼 수정
2. 주문서 사이즈, 시트, 필링 ordersection 추가
3. 내 주문서 보기 기능 (주문내역 백엔드에서 불러오기 기능 추가)


--예정--
- 애뮬마다 높이 다른 거 수정
- 사진 업로드 할때 정사각형으로 잘라 올리는 기능 
- 주문확인 창 UI
- 내 주문서 보기 기능 (주문내역 백엔드에서 불러오기 기능 추가)
- 사장님 프로필 / 메인 화면 / 찜 목록 등에는 썸네일 1장만 서버에 전달, 
    - 글 상세보기는 전체 이미지 전부 전달하는 코드 작성 (백엔드도 테이블 만들어야함)
    - CakePostImage라는 서브 테이블 만들어서,
      cake_post_id로 연결하면 좋음