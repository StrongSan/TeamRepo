import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface RadioOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const RadioOption: React.FC<RadioOptionProps> = ({
  label,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onSelect}>
      <View
        style={[styles.radioButton, selected && styles.radioButtonSelected]}
      >
        {selected ? <View style={styles.radioButtonInner} /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#D7D7D7",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#E78182",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E78182",
  },
  label: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#000",
  },
});

export default RadioOption;
