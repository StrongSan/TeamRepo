import React from "react";
import { Image, StyleSheet } from "react-native";

// ✅ 변경: uri prop으로 이미지 경로 받음
const ProductImage: React.FC<{ uri: string }> = ({ uri }) => (
  <Image source={{ uri }} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
});

export default ProductImage;