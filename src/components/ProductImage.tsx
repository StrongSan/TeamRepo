import React from "react";
import { View, StyleSheet, Image} from "react-native";

const ProductImage: React.FC = () => {
    return (
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_PubMSxSFV67yvE7k1ELhmbCIZ5O1NWznxQ&s" }}
          resizeMode="cover"
        />
      </View>
    );
  };
  

const styles = StyleSheet.create({
  imageContainer: {
    display: "flex",
    marginTop: 14,
    width: "100%",
    height: 350,
    aspectRatio: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
  },
  image: {
  width: "100%",
  aspectRatio: 1,
  borderRadius: 16,
  overflow: "hidden",
}
,
});

export default ProductImage;