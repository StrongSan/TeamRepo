import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import TopBar from '../components/TopBar';
import OrderCard from '../components/OrderCard';

const MyReservationScreen: React.FC = () => {
  const activeOrders = [
    {
      orderDate: '2025-04-10',
      itemName: '떡 케이크',
      quantity: 1,
      totalPrice: '48,900',
    },
  ];

  const pastOrders = [
    {
      orderDate: '2025-02-12',
      itemName: '레터링 케이크',
      quantity: 1,
      totalPrice: '43,000',
    },
  ];

  const handleOrderDetails = () => {
    // 주문 상세 화면으로 이동
  };

  const handleInquiry = () => {
    // 문의하기 실행
  };

  const [tab, setTab] = React.useState<'active' | 'past'>('past');

  const currentList = tab === 'active' ? activeOrders : pastOrders;

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="마이 예약" />

      <View style={styles.tabWrapper}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            tab === 'active' && styles.selectedTab,
          ]}
          onPress={() => setTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              tab === 'active' && styles.selectedTabText,
            ]}
          >
            진행 중인 주문
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            tab === 'past' && styles.selectedTab,
          ]}
          onPress={() => setTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              tab === 'past' && styles.selectedTabText,
            ]}
          >
            지난 주문
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentList.map((order, index) => (
          <View key={index} style={styles.cardWrapper}>
            <OrderCard
              orderDetails={order}
              onOrderDetails={handleOrderDetails}
              onInquiry={handleInquiry}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#F5D9D9',
    borderRadius: 12,
    padding: 4,
    marginVertical: 10,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B35D5D',
  },
  selectedTabText: {
    color: '#E78182',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
    gap: 30,
  },
  cardWrapper: {
    width: '100%',
  },
});

export default MyReservationScreen;
