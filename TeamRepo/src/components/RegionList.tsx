import * as React from "react";
import { View, StyleSheet } from "react-native";
import RegionItem from "./RegionItem";

interface RegionListProps {
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
}

const RegionList: React.FC<RegionListProps> = ({
  selectedRegions,
  onToggleRegion,
}) => {
  const regions = [
    "서울",
    "청주",
    "경기",
    "대전",
    "부산",
    "대구",
    "광주",
    "강원",
    "제주",
  ];

  return (
    <View style={styles.container}>
      {regions.map((region) => (
        <RegionItem
          key={region}
          region={region}
          isSelected={selectedRegions.includes(region)}
          onToggle={() => onToggleRegion(region)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
});

export default RegionList;
