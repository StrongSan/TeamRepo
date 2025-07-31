import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import SelectionIndicator from "./SelectionIndicator";

interface RegionItemProps {
  region: string;
  isSelected: boolean;
  onToggle: () => void;
}

const RegionItem: React.FC<RegionItemProps> = ({
  region,
  isSelected,
  onToggle,
}) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
      <Text style={styles.regionText}>{region}</Text>
      <SelectionIndicator isSelected={isSelected} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    height: 48,
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 12,
    paddingLeft: 16,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    backgroundColor: "#F9FAF8",
  },
  regionText: {
    fontFamily: "Poppins",
    fontSize: 15,
    color: "#363A33",
    lineHeight: 25.5, // 170% of 15px
  },
});

export default RegionItem;
