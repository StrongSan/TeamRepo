import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import HeartIcon from "../../assets/icons/heart-outline.svg";
import HeartFilledIcon from "../../assets/icons/heart-filled.svg";

interface ProductInfoProps {
  title: string;
  price: string;
  description: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ title, price, description }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titlePrice}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>
            {Number(price).toLocaleString()} 원
          </Text>
        </View>

        <TouchableOpacity onPress={toggleLike} style={styles.heartButton}>
          {liked ? (
            <HeartFilledIcon width={24} height={24} />
          ) : (
            <HeartIcon width={24} height={24} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>
        {description.replace(/\\n/g, "\n")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: "90%",
    maxWidth: 360,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titlePrice: {
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#040415",
  },
  price: {
    fontSize: 16,
    color: "#595959",
    marginTop: 4,
  },
  heartButton: {
    padding: 4,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
});

export default ProductInfo;
