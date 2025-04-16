import * as React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import ArrowBottom from "../../assets/icons/arrowBottom.svg";

interface FormFieldWithDropdownProps {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
}

const FormFieldWithDropdown: React.FC<FormFieldWithDropdownProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="rgba(0,0,0,0.5)"
          editable={false}
          onPressIn={onPress}
        />
        <ArrowBottom />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0, // OrderFormInput과 동일
  },
  label: {
    color: "#000",
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 6, // gap 대신 marginBottom으로 통일
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
    color: "rgba(0,0,0,0.5)",
    fontFamily: "Roboto",
    fontSize: 14,
    lineHeight: 20,
  },
});


export default FormFieldWithDropdown;
