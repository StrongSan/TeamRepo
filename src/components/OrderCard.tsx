import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// 이 컴포넌트에서 사용하는 props 타입 정의
interface OrderDetails {
  orderDate: string;
  itemName: string;
  quantity: number;
  totalPrice: string;
}

interface OrderCardProps {
  orderDetails: OrderDetails;
  onOrderDetails: () => void;
  onInquiry: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ orderDetails, onOrderDetails, onInquiry }) => {
  return (
    <View style={styles.container}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer} />
        <View style={styles.detailsContainer}>
          <Text style={styles.itemName}>{orderDetails.itemName}</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>주문일시</Text>
              <Text style={styles.value}>{orderDetails.orderDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>주문내역</Text>
              <View style={styles.orderSummary}>
                <View style={styles.quantityRow}>
                  <Text style={styles.itemDetail}>{orderDetails.itemName}</Text>
                  <Text style={styles.quantity}>x{orderDetails.quantity}</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>결제금액</Text>
              <Text style={styles.price}>{orderDetails.totalPrice}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onOrderDetails}>
          <Text style={styles.buttonText}>주문상세</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onInquiry}>
          <Text style={styles.buttonText}>문의하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    gap: 12,
  },
  cardContent: {
    display: 'flex',
    height: 104,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  imageContainer: {
    borderRadius: 8,
    backgroundColor: '#C4C4C4',
    width: 109,
    height: 108,
  },
  detailsContainer: {
    flex: 1,
    gap: 8,
  },
  itemName: {
    color: '#60655c',
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 26,
  },
  infoContainer: {
    marginTop: 8,
    width: '100%',
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 22,
    gap: 16,
  },
  label: {
    color: '#60655c',
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 20,
  },
  value: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    lineHeight: 16,
  },
  orderSummary: {
    flex: 1,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemDetail: {
    fontFamily: 'Poppins',
    color: '#60655c',
    lineHeight: 20,
  },
  quantity: {
    textAlign: 'right',
    fontFamily: 'Roboto',
    fontWeight: '600',
  },
  price: {
    color: '#363a33',
    fontFamily: 'Roboto',
    fontWeight: '600',
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8EBE6',
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#363a33',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
});

export default OrderCard;
