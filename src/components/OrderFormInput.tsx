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

    // 외부에서 value를 제어할 수 있게 prop 추가
    value: string;
    onChangeText?: (text: string) => void;

    // 오른쪽 아이콘을 눌렀을 때 동작할 콜백 추가
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
    value, //props 구조 분해에 추가
    onPressRightIcon , // props 구조 분해 추가
    onChangeText,
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
            value= {value} // value prop 연결
            onChangeText={onChangeText}
            editable = {!onPressRightIcon} // 아이콘 클릭만 허용 시 textIcon 비활성화화
          />
          {/* 아이콘에 Pressable 래핑 및 클릭 핸들러 연결 */}
        {rightIcon && onPressRightIcon ? (
          <Pressable onPress={onPressRightIcon}>
            {rightIcon}
          </Pressable>
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
