import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, KeyboardTypeOptions } from "react-native";
import ArrowRightIcon from "../../assets/icons/arrowRight.svg";

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  showArrow?: boolean;
  onPressArrow?: () => void;
  keyboardType?: KeyboardTypeOptions;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  showArrow = false,
  onPressArrow,
  keyboardType,
}) => {

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={!showArrow}
        keyboardType={keyboardType}
      />
      {showArrow && onPressArrow && (
        <TouchableOpacity onPress={onPressArrow} style={styles.arrowContainer}>
        <ArrowRightIcon width={24} height={24} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8EBE6",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingVertical: 0,
    includeFontPadding: false,
    fontFamily: "Poppins",
  },
  
  arrowContainer: {
    marginLeft: 16,
  },
});

export default InputField;
