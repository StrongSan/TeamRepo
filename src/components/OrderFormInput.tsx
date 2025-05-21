import React from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { KeyboardTypeOptions } from "react-native";

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string; 
  onChangeText: (text: string) => void;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  height?: number;
  keyboardType?: KeyboardTypeOptions;
  onPressRightIcon?: () => void;
}

  
 const OrderFormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  rightIcon,
  multiline,
  height,
  keyboardType,
  onPressRightIcon,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, multiline && { height }]}>
        <TextInput
          style={[styles.input, multiline && { height: height! - 16 }]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholderTextColor="rgba(0,0,0,0.5)"
          keyboardType={keyboardType}
          editable={!onPressRightIcon}
        />
        {rightIcon && onPressRightIcon ? (
          <Pressable onPress={onPressRightIcon}>{rightIcon}</Pressable>
        ) : (
          rightIcon
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  label: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 6,
    fontFamily: "Roboto",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.9)",
    fontFamily: "Roboto",
  },
});

export default OrderFormInput;
