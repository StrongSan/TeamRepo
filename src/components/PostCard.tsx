// src/components/PostCard.tsx
import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import type { Post } from "../api/postAPI";

type Props = {
  post: Post;
  userType: "seller" | "customer";
};

const PostCard: React.FC<Props> = ({ post }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { userType } = (route.params as any) || {}; // ✅ userType도 넘겨주기

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductDetail", {
          post,
          userType,
        })
      }
    >
      <Image source={{ uri: post.imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {post.title}
        </Text>
        <Text style={styles.price}>{post.price}원</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
  },
  textContainer: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  price: {
    fontSize: 13,
    color: "#777",
  },
});

export default PostCard;
