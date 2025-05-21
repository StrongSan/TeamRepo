import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import TopBar from '../components/TopBar';
import OrderCard from '../components/OrderCard';
import KakaoPayButton from '../components/KakaoPayButton';

const PaymentScreen: React.FC = () => {
  const orderDetails = {
    orderDate: '2025-04-10',
    itemName: '레터링 케이크',
    quantity: 1,
    totalPrice: '48,900',
  };

  const handleBackPress = () => {
    // Handle back navigation
  };

  const handleOrderDetails = () => {
    // Handle order details action
  };

  const handleInquiry = () => {
    // Handle inquiry action
  };

  const handlePayment = () => {
    // Handle payment action
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="결제하기" onBackPress={handleBackPress} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.orderCount}>주문 케이크 총 1개</Text>
        <View style={styles.content}>
          <OrderCard
            orderDetails={orderDetails}
            onOrderDetails={handleOrderDetails}
            onInquiry={handleInquiry}
          />
          <KakaoPayButton onPress={handlePayment} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  orderCount: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 20,
    fontFamily: 'Inder',
    fontWeight: '400',
    marginTop: 30,
    textAlign: 'center',
  },
  content: {
    marginTop: 33,
    width: '100%',
    maxWidth: 335,
    alignSelf: 'center',
  },
});

export default PaymentScreen;
