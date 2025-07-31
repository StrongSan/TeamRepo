import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import KakaoIcon from '../../assets/icons/kakao-icon.svg'; 

interface KakaoPayButtonProps {
  onPress: () => void;
}

const KakaoPayButton: React.FC<KakaoPayButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <KakaoIcon width={18} height={18} />
      <Text style={styles.text}>카카오페이로 결제하기</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8EBE6',
    backgroundColor: '#FEE500',
    marginTop: 15,
    minHeight: 40,
    width: '100%',
    gap: 4,
    paddingVertical: 8,
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#363a33',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
});

export default KakaoPayButton;