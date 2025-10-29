import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
import { deleteMyAccount } from '../api/userAPI';


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
      '로그아웃 하시겠습니까?',
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

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원탈퇴',
      '모든 데이터가 삭제될 수 있습니다.\n탈퇴하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴', style: 'destructive', onPress: async () => {
          try {
            await deleteMyAccount();
            // 성공 시에만 로그아웃 및 이동
            await logout();
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
            );
          } catch (e: any) {
            const status = e?.response?.status;
            const message = e?.response?.data?.message || e?.response?.data?.error;
            if (status === 409) {
              Alert.alert('탈퇴 불가', '진행 중인 주문이 있어 탈퇴할 수 없습니다. 모든 주문을 완료하거나 취소한 뒤 다시 시도해주세요.');
            } else {
              Alert.alert('오류', message || '회원탈퇴 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
            // 실패 시에는 로그아웃/화면 이동하지 않음
          }
        }}
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>주문</Text>

      {/* 텍스트만 userType에 따라 변경 */}
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
        iconProps={{ width: 20, height: 20 }}
      />

      {/* 버튼은 하단 고정 푸터(MypageScreen)에서 렌더링 */}
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
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    marginTop: 24,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#f6d8dc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#d9556a',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteAccountButton: {
    flex: 1,
    backgroundColor: '#E78182',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteAccountButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default OrderSection;
