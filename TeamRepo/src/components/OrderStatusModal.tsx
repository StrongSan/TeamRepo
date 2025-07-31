// OrderStatusModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import OrderRequestIcon from '../assets/icons/order-request.svg';
import OrderApprovedIcon from '../assets/icons/order-approved.svg';
import OrderSuccessIcon from '../assets/icons/order-success.svg';

interface Props {
  visible: boolean;
  onClose: () => void;
  type: 'requested' | 'approved' | 'success';
  cakeName?: string;
  price?: string;
}

const OrderStatusModal: React.FC<Props> = ({ visible, onClose, type, cakeName, price }) => {
  const renderIcon = () => {
    switch (type) {
      case 'requested':
        return <OrderRequestIcon width={56} height={56} />;
      case 'approved':
        return <OrderApprovedIcon width={56} height={56} />;
      case 'success':
        return <OrderSuccessIcon width={56} height={56} />;
    }
  };

  const renderTitle = () => {
    switch (type) {
      case 'requested':
        return '주문 요청이 완료되었어요!';
      case 'approved':
        return '주문 요청이 승인되었어요!';
      case 'success':
        return '주문 성공!';
    }
  };

  const renderSub = () => {
    switch (type) {
      case 'requested':
        return '사장님이 승인하면 알려드릴게요';
      case 'approved':
        return '결제만 하면 픽업이 확정돼요';
      case 'success':
        return '픽업 날짜에 뵈어요 :-)';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.iconBox}>{renderIcon()}</View>
          <Text style={styles.title}>{renderTitle()}</Text>
          <Text style={styles.sub}>{renderSub()}</Text>

          <View style={styles.detailBox}>
            <View style={styles.row}><Text style={styles.label}>주문 내역</Text></View>
            {cakeName && <View style={styles.row}><Text>{cakeName}</Text></View>}
            {price && <View style={styles.row}><Text style={styles.label}>결제 금액</Text><Text>{price}</Text></View>}
          </View>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center'
  },
  iconBox: {
    marginBottom: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4
  },
  sub: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  detailBox: {
    width: '100%',
    padding: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4
  },
  label: {
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#E78182',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  buttonText: {
    color: 'white',
    fontWeight: '600'
  }
});

export default OrderStatusModal;
