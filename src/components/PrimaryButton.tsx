import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonBase, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.textBase, textStyle]}>{title}</Text>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#CCCCCC",
  },
  textBase: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PrimaryButton;
