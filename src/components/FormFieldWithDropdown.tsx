import * as React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import ArrowBottom from "../../assets/icons/arrowBottom.svg";

interface FormFieldWithDropdownProps {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  visible?: boolean;
  options?: string[];
  onSelect?: (value: string) => void;
}

const FormFieldWithDropdown: React.FC<FormFieldWithDropdownProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onPress,
  visible = false,
  options = [],
  onSelect = () => {},
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      pointerEvents="none" 
      editable={false}
      placeholderTextColor="rgba(0,0,0,0.5)"
    />
    <ArrowBottom />
  </View>
</TouchableOpacity>

      {visible && (
  <View style={styles.dropdown}>
    {options.map((option) => (
      <TouchableOpacity
        key={option}
        onPress={() => onSelect(option)}
        style={styles.dropdownItem}
      >
        <Text>{option}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}

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
    color: "rgba(0,0,0,0.9)",
    fontFamily: "Roboto",
    fontSize: 14,
    lineHeight: 20,
  },
dropdown: {
  position: 'relative',
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  zIndex: 10,
}
,
  
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  
});


export default FormFieldWithDropdown;
