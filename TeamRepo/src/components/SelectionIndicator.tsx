import * as React from "react";
import { View, StyleSheet } from "react-native";

interface SelectionIndicatorProps {
  isSelected: boolean;
}

const SelectionIndicator: React.FC<SelectionIndicatorProps> = ({
  isSelected,
}) => {
  return (
    <View style={styles.container}>
      {isSelected ? <View style={styles.indicator} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E8EBE6",
    backgroundColor: "#F4F7F2",
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: "#E78182",
  },
});

export default SelectionIndicator;
