import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';
import KakaoIcon from '../../assets/icons/kakao-icon.svg'

type KakaoButtonProps = {
  onPress: () => void;
};

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 768;



const KakaoButton: React.FC<KakaoButtonProps> = ({ onPress }) => {
  const getIconSize = () => {
    if (isSmallScreen) return 28;
    if (isMediumScreen) return 32;
    return 36;
  };

  const iconSize = getIconSize();

  return (
<TouchableOpacity
  style={styles.button}
  onPress={onPress}
  activeOpacity={0.8}
>
      <View style={styles.buttonContent}>
        <KakaoIcon width={36} height={36} /> 
        <Text style={styles.buttonText}>카카오 로그인</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    width: "100%",
    padding: 20,
    backgroundColor: "#FEE500",
    borderRadius: 12,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    width: 217,
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 29,
    fontWeight: "400",
    fontFamily: "Inder",
    color: "#000",
  },
});

export default KakaoButton;
