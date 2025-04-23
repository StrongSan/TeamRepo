import React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";

const imageList = [
  require("../../assets/images/stcho3.jpg"),
  require("../../assets/images/cho1.jpg"),
  require("../../assets/images/stcho2.jpg"),
  require("../../assets/images/stcho4.jpg"),
  require("../../assets/images/st1.jpg"),
  require("../../assets/images/cho2.jpg"),
  require("../../assets/images/st2.jpg"),
  require("../../assets/images/stcho1.jpg"),
]

const GridLayout: React.FC = () => {
  const gridItems = Array(10).fill(null);

  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridContent}>
        {imageList.map((img, index) => (
          <View key={index} style={styles.gridItem} >
            <Image source={img} style={styles.gridItem} />
          </View>
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
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  }
});

export default GridLayout;