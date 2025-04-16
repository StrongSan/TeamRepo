import * as React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  placeholder: string;
  multiline?: boolean;
  style?: object;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  multiline = false,
  style = {},
  ...props
}) => {
  return (
    <View
      style={[styles.container, multiline && styles.multilineContainer, style]}
    >
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={placeholder}
            style={[styles.input, multiline && styles.multilineInput]}
            multiline={multiline}
            placeholderTextColor="#000000"
            {...props}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: "100%",
    fontFamily: "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
    letterSpacing: 0.15,
    marginBottom: 20,
  },
  multilineContainer: {
    minHeight: 224,
  },
  inputWrapper: {
    borderRadius: 10,
    width: "100%",
    flex: 1,
  },
  inputContainer: {
    borderColor: "rgba(196, 196, 196, 1)",
    borderStyle: "solid",
    borderWidth: 1,
    width: "100%",
    paddingLeft: 12,
    paddingRight: 12,
    flex: 1,
  },
  input: {
    flex: 1,
    width: "100%",
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 16,
    fontFamily: "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
    color: "#000000",
  },
  multilineInput: {
    textAlignVertical: "top",
    height: 192, // Adjust as needed
  },
});

export default InputField;
