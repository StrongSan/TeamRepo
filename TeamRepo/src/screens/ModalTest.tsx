import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import OrderStatusModal from '../components/OrderStatusModal'; // 모달 컴포넌트 경로 확인
import OrderRequestIcon from '../../assets/icons/order-request.svg';
import OrderApprovedIcon from '../../assets/icons/order-approved.svg';
import OrderSuccessIcon from '../../assets/icons/order-success.svg';

const ModalTest = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'requested' | 'approved' | 'success'>('requested');

  const handleOpenModal = (type: 'requested' | 'approved' | 'success') => {
    setModalType(type);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>모달 테스트 화면</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleOpenModal('requested')}>
        <Text style={styles.buttonText}>주문 요청 완료</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleOpenModal('approved')}>
        <Text style={styles.buttonText}>주문 승인 완료</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleOpenModal('success')}>
        <Text style={styles.buttonText}>주문 성공</Text>
      </TouchableOpacity>

      <OrderStatusModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalType}
        cakeName="떡 케이크"
        price="48,900원"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#E78182',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ModalTest;
