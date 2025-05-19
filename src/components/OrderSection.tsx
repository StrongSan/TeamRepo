import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuOption from './MenuOption';
import MyOrder from '../../assets/icons/myOrder.svg';
import MyReview from '../../assets/icons/myReview.svg';
import LogoutIcon from '../../assets/icons/logout-icon.svg';
import ArrowRightIcon from '../../assets/icons/arrowRight.svg';

console.log('MyOrder:', MyOrder);
console.log('MyReview:', MyReview);
console.log('LogoutIcon:', LogoutIcon);
console.log('ArrowRightIcon:', ArrowRightIcon);


const OrderSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>주문</Text>
      <MenuOption
        icon={MyReview}
        title="내 가게 리뷰"
        rightIcon={ArrowRightIcon}
        iconProps={{ width: 20, height: 20 }}
      />
      <MenuOption
        icon={MyOrder}
        title="마이 예약"
        rightIcon={ArrowRightIcon}
      />
      <MenuOption
        icon={LogoutIcon}
        title="로그아웃"
        customStyles={styles.logoutButton}
        textColor="#FFF"
        iconProps={{width: 20, height: 20}}
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