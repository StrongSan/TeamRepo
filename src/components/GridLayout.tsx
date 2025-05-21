import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  ProductDetail: {
    userType: "seller" | "customer";
    post: {
      postId: number;
      title: string;
      imageUrl: string;
      price: string;
      description: string;
      cakeId: number; // ✅ 추가됨
    };
  };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

interface GridLayoutProps {
  posts: {
    postId: number;
    title: string;
    imageUrl: string;
    price: string;
    description: string;
    cakeId: number; // ✅ 추가됨
  }[];
}

const GridLayout: React.FC<GridLayoutProps> = ({ posts }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.gridContainer}>
      {posts.map((post) => (
        <TouchableOpacity
          key={post.postId}
          style={styles.postCard}
          onPress={() =>
            navigation.navigate("ProductDetail", {
              userType: "customer",
              post: post,
            })
          }
        >
          <Image source={{ uri: post.imageUrl }} style={styles.image} />
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.price}>{post.price}원</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  postCard: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 8,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    color: "#888",
  },
});

export default GridLayout;
