import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import TopBar from "../components/TopBar";
import CustomerBottomBar from "../components/CustomerBottomBar";
import SellerBottomBar from "../components/SellerBottomBar";
import ProfileCard from '../components/ProfileCard';
import SettingsSection from '../components/SettingsSection';
import OrderSection from '../components/OrderSection';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { logout } from '../api/authAPI';
import { deleteMyAccount } from '../api/userAPI';

type MypageRouteProp = RouteProp<RootStackParamList, 'MypageScreen'>;

const MypageScreen: React.FC = () => {
  const route = useRoute<MypageRouteProp>();
  const { userType, userId } = route.params; // userId 추가
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
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
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMyAccount();
              await logout();
              navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
              );
            } catch (e: any) {
              const status = e?.response?.status;
              const message = e?.response?.data?.message || e?.response?.data?.error;
              if (status === 409) {
                Alert.alert('탈퇴 불가', '진행 중인 주문이 있어 탈퇴할 수 없습니다.');
              } else {
                Alert.alert('오류', message || '회원탈퇴 중 오류가 발생했습니다.');
              }
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <TopBar title="마이페이지" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <ProfileCard />
          <View style={styles.sectionsContainer}>
            <SettingsSection />
            {userType === 'seller' ? (
              <OrderSection userType="seller" userId={userId} />
            ) : (
              <OrderSection userType="customer" userId={userId} />
            )}
          </View>
        </View>
      </ScrollView>
      {/* 하단 고정 버튼 (하단바 바로 위) */}
      <View style={styles.footerActions}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteAccountButtonText}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>

      {userType === 'seller' ? (
        <SellerBottomBar userId={userId} />
      ) : (
        <CustomerBottomBar userId={userId} />
      )}
    </>
  );
};


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 480,
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 120,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sectionsContainer: {
    marginTop: 24,
    gap: 16,
  },
  footerActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 72, // 하단바 바로 위에 위치
    flexDirection: 'row',
    gap: 8,
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

export default MypageScreen;
