// TestButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import TestIcon from '../../assets/icons/upload-icon.svg';


interface TestButtonProps {
  onPress: () => void;
}

const TestButton: React.FC<TestButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.content}>
        <TestIcon width={18} height={18} color={ "#ffffff" } />
        <Text style={styles.text}>사진 업로드</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E78182",
    borderRadius: 8,
    alignItems: "center",
  },
  content:{
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TestButton;
