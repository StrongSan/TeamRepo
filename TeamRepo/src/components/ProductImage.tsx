import React from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth * 0.8; // 80%로 계산

const ProductImage: React.FC<{ uri: string }> = ({ uri }) => (
  <View style={[styles.wrapper, { width: imageSize, height: imageSize }]}>
    <Image source={{ uri }} style={styles.image} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 16,
    alignSelf: "center", // 가운데 정렬
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default ProductImage;
