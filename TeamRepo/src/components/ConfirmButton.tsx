import * as React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface ConfirmButtonProps {
  onPress: () => void;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>확인</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 10,
    backgroundColor: "#E78182",
    marginTop: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ConfirmButton;
