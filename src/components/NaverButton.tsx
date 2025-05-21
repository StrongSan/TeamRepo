import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import NaverIcon from "../../assets/icons/naver-icon.svg";
import NaverIcon from '../../assets/icons/naver-icon.svg';
import { useNaverLogin } from "../hooks/useNaverLogin";

const NaverButton: React.FC = () => {
  const { handleNaverLogin } = useNaverLogin(); 

  return (
    <TouchableOpacity style={styles.button} onPress={handleNaverLogin}>
      <View style={styles.buttonContent}>
        <NaverIcon width={32} height={32} />
        <Text style={styles.buttonText}>네이버 로그인</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 21,
    paddingHorizontal: 12,
    backgroundColor: "#03C75A",
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
    color: "#FFFFFF",
    lineHeight: 34,
  },
});

export default NaverButton;
