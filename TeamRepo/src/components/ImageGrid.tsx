import * as React from "react";
import { View, StyleSheet } from "react-native";

const ImageGrid = () => {
  const renderImageRow = (rowIndex: number) => {
    return (
      <View style={styles.imageRow} key={`row-${rowIndex}`}>
        <View style={styles.imagePlaceholder} />
        <View style={styles.imagePlaceholder} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map((index: number) => renderImageRow(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginTop: 16,
  },
  imageRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
    borderRadius: 8,
  },
});

export default ImageGrid;
