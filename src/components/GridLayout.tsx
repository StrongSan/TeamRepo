import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const GridLayout: React.FC = () => {

  const gridItems = Array(10).fill(null);

  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridContent}>
        {gridItems.map((_, index) => (
          <View key={index} style={styles.gridItem} />
        ))}
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 34) / 2; 

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal:12,
  },
  gridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    marginBottom: 10,
  },
});

export default GridLayout;