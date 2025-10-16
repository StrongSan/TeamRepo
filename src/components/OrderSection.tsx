import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import MenuOption from './MenuOption';
import MyOrder from '../../assets/icons/myOrder.svg';
import MyReview from '../../assets/icons/myReview.svg';
import LogoutIcon from '../../assets/icons/logout-icon.svg';
import ArrowRightIcon from '../../assets/icons/arrowRight.svg';
import { RootStackParamList } from '../navigation/AppNavigator';
import { logout } from '../api/authAPI';


interface OrderSectionProps {
  userType: 'seller' | 'customer';
  userId: string;
}


const OrderSection: React.FC<OrderSectionProps> = ({ userType, userId }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  console.log('dddd[OrderSection] userType:', userType);

  const handleOrderHistoryPress = () => {
    navigation.navigate('MyReservations', { userId, userType });
  };

  const handleMyReviewsPress = () => {
    navigation.navigate('MyReviews', { userId });
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          style: 'destructive',
          onPress: async () => {
            console.log('로그아웃 프로세스 시작...');
            
            // 백엔드 로그아웃 API 호출 + 로컬 토큰 삭제
            // logout()은 절대 에러를 throw하지 않음 (항상 로컬 토큰 삭제)
            await logout();
            
            console.log('로그아웃 프로세스 완료');
            
            // 네비게이션 스택을 완전히 리셋하고 로그인 화면으로 이동
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>주문</Text>

      {/* ✅ 텍스트만 userType에 따라 변경 */}
      <MenuOption
        icon={MyReview}
        title={userType === 'seller' ? '내 가게 리뷰' : '내 리뷰'}
        rightIcon={ArrowRightIcon}
        onPress={handleMyReviewsPress}
        iconProps={{ width: 20, height: 20 }}
      />

      <MenuOption
        icon={MyOrder}
        title={userType === 'seller' ? '마이 예약' : '주문내역'}
        rightIcon={ArrowRightIcon}
        onPress={handleOrderHistoryPress}
      />

      <MenuOption
        icon={LogoutIcon}
        title="로그아웃"
        customStyles={styles.logoutButton}
        textColor="#FFF"
        iconProps={{ width: 20, height: 20 }}
        onPress={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#70756b',
    fontFamily: 'Poppins',
    fontWeight: '600',
    lineHeight: 20.4,
    paddingHorizontal: 8,
  },
  logoutButton: {
    backgroundColor: '#E78182',
    borderColor: '#E78182',
    position: 'absolute',
    bottom: -89,
    width: '100%',
    maxWidth: '100%',
    height: 48,
  },
});

export default OrderSection;
