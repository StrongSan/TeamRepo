import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface CakeTypeChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const CakeTypeChip: React.FC<CakeTypeChipProps> = ({
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.selectedChip]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.selectedChipText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 6,
    borderColor: "rgba(231, 129, 130, 1)",
    borderStyle: "solid",
    borderWidth: 2,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    alignSelf: "flex-start",
  },
  selectedChip: {
    backgroundColor: "rgba(231, 129, 130, 1)",
  },
  chipText: {
    color: "rgba(231, 129, 130, 1)",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
  },
  selectedChipText: {
    color: "rgba(255, 255, 255, 1)",
  },
});

export default CakeTypeChip;
