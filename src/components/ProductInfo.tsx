import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import HeartIcon from "../../assets/icons/heart-outline.svg"; 
import HeartFilledIcon from "../../assets/icons/heart-filled.svg"; 

interface ProductInfoProps {
  title: string;
  price: string;
  description: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  title,
  price,
  description,
}) => {

  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titlePrice}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>

        <TouchableOpacity onPress={toggleLike} style={styles.heartButton}>
          {
            liked ? (
              < HeartFilledIcon width={24} height={24} />
            ) : (
              <HeartIcon width={24} height={24} />
            )
          }
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{description.replace(/\\n/g, "\n")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    width: "100%",
    maxWidth: 342,
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
    color: "#040415",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  },
  price: {
    color: "rgba(89, 89, 89, 1)",
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
    marginTop: 5,
  },

  heartButton: {
    padding: 4,
  },

  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  },
});

export default ProductInfo;
