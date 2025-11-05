import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BASE_URL } from '../api/config';
import { OrderDetailResponse } from '../api/orderAPI';

interface OrderPreviewCardProps {
  orderInfo: OrderDetailResponse;
  orderId: string;
}

const OrderPreviewCard: React.FC<OrderPreviewCardProps> = ({ orderInfo, orderId }) => {
  const imageUrl = orderInfo.cakeInfo.imageUrl || orderInfo.thumbnail;
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${BASE_URL}/images/${imageUrl}`
    : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&h=80&fit=crop&crop=center';

  return (
    <View style={styles.orderPreview}>
      <Image
        source={{ uri: fullImageUrl }}
        style={styles.cakePreviewImage}
        onError={() => {}}
        onLoad={() => {}}
      />
      <View style={styles.orderInfo}>
        <Text style={styles.cakeTitle}>{orderInfo.cakeInfo.title}</Text>
        <Text style={styles.orderIdText}>주문번호: {orderId}</Text>
        <Text style={styles.orderDateText}>픽업일: {orderInfo.pickupDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderPreview: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginVertical: 16,
    gap: 12,
  },
  cakePreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cakeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  orderDateText: {
    fontSize: 12,
    color: '#666',
  },
});

export default OrderPreviewCard;
