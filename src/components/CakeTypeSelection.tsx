import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CakeTypeChip from "./CakeTypeChip";

interface CakeTypeSelectionProps {
  selectedTypes: string[];
  onToggleType: (type: string) => void;
}

const CakeTypeSelection: React.FC<CakeTypeSelectionProps> = ({
  selectedTypes,
  onToggleType,
}) => {
  const cakeTypes = [
    ["레터링 케이크", "떡 케이크", "유아용 케이크"],
    ["포토 케이크", "이벤트 케이크", "플라워 케이크"],
    ["웨딩 케이크", "2단 케이크", "기타"],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>케이크 종류</Text>
      </View>

      {cakeTypes.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.chipRow}>
          {row.map((type) => (
            <CakeTypeChip
              key={type}
              label={type}
              selected={selectedTypes.includes(type)}
              onPress={() => onToggleType(type)}
            />
          ))}
        </View>
      ))}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "100%",
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 12,
    paddingBottom: 29,
    overflow: "hidden",
    fontFamily: "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    color: "rgba(231, 129, 130, 1)",
    fontWeight: "600",
  },
  titleContainer: {
    marginBottom: 4,
  },
  title: {
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: "Roboto, -apple-system, Roboto, Helvetica, sans-serif",
  },
  chipRow: {
    display: "flex",
    marginTop: 4,
    width: "100%",
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default CakeTypeSelection;
