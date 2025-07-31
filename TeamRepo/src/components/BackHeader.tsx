import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BackIcon from "../../assets/icons/back-icon.svg"; 

interface BackHeaderProps {
  title: React.ReactNode;
  onBack: () => void;
}

const BackHeader: React.FC<BackHeaderProps> = ({ title, onBack }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <BackIcon width={39} height={39} />
      </TouchableOpacity>
      <Text style={styles.title}>
        {/*
          조건을 체크해서 문자열일 때만 안전하게 보여주기
        */}
        {typeof title === "string" ? title : ""}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
  },
  backButton: {
    width: 39,
    height: 39,
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: -0.3,
    marginTop: 10,
  },
});

export default BackHeader;
