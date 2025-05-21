import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import OrderRequestIcon from '../../assets/icons/order-request.svg';
import OrderApprovedIcon from '../../assets/icons/order-approved.svg';
import OrderSuccessIcon from '../../assets/icons/order-success.svg';

interface Props {
  visible: boolean;
  onClose: () => void;
  type: 'requested' | 'approved' | 'success';
  cakeName: string;
  price?: string;
  onNext?: () => void;
}

const OrderFlowModal: React.FC<Props> = ({ visible, onClose, type, cakeName, price, onNext }) => {
  const renderContent = () => {
    switch (type) {
      case 'requested':
        return {
          icon: <OrderRequestIcon width={56} height={56} />,
          title: '주문 요청이 완료되었어요!',
          sub: '사장님이 승인하면 알려드릴게요',
            buttons: [
               { label: '주문 요청 취소하기', onPress: onNext },
               { label: '확인', onPress: onClose, outline: true },
                ],
        };
      case 'approved':
        return {
          icon: <OrderApprovedIcon width={56} height={56} />,
          title: '주문 요청이 승인되었어요!',
          sub: '결제만 하면 픽업이 확정돼요',
          buttons: [
            { label: '결제하기', onPress: onNext },
            { label: '주문 취소 요청', onPress: onClose, outline: true },
          ],
        };
      case 'success':
        return {
          icon: <OrderSuccessIcon width={56} height={56} />,
          title: '주문 성공!',
          sub: '픽업 날짜에 뵈어요 :-)',
          buttons: [
            { label: '케이크 더 구경하기', onPress: onClose },
            { label: '주문내역 상세', onPress: onNext, outline: true },
          ],
        };
    }
  };

  const content = renderContent();

return (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        
        {/* ✅ 오른쪽 상단 X 버튼 */}
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>
        
        <View style={styles.iconBox}>{content.icon}</View>

        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.sub}>{content.sub}</Text>

        <View style={styles.detailBox}>
          <View style={styles.row}><Text style={styles.label}>주문 내역</Text></View>
          <View style={styles.row}>
            <Text>{cakeName}</Text>
            {price && <Text>{price}</Text>}
          </View>
        </View>

        {content.buttons.map((btn, idx) => (
          <Pressable
            key={idx}
            style={[styles.button, btn.outline && styles.outlineButton]}
            onPress={btn.onPress}
          >
            <Text style={[styles.buttonText, btn.outline && styles.outlineText]}>{btn.label}</Text>
          </Pressable>
        ))}
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
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  sub: { fontSize: 14, color: '#666', marginBottom: 20 },
  detailBox: {
    width: '100%',
    padding: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: { fontWeight: '600' },
  button: {
    backgroundColor: '#E78182',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E78182',
  },
  outlineText: {
    color: '#E78182',
  },
    closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#aaa',
  },

  iconBox: {
    marginTop: 30,
  marginBottom: 30,
  alignItems: 'center',
  justifyContent: 'center',
}


});

export default OrderFlowModal;
