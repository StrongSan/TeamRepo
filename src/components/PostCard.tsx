import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import type { Post } from "../api/postAPI";
import { saveViewedCake } from "../api/postAPI"; // ✅ 추가

type Props = {
  post: Post;
  userType: "seller" | "customer";
  userId: string; // ✅ userId를 props로 받도록 수정
};

const PostCard: React.FC<Props> = ({ post, userType, userId }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 디버깅: 이미지 URL 확인
  console.log('PostCard 이미지 URL:', {
    postId: post.postId,
    title: post.title,
    imageUrl: post.imageUrl,
    imageUrlType: typeof post.imageUrl,
    imageUrlLength: post.imageUrl?.length
  });

  const handlePress = async () => {
    await saveViewedCake(userId, post.postId); // ✅ 조회 기록 저장
    navigation.navigate("ProductDetail", {
      post,
      userType,
      userId,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image 
        source={{ uri: post.imageUrl }} 
        style={styles.image}
        onError={(error) => {
          console.log('PostCard 이미지 로드 실패:', {
            postId: post.postId,
            title: post.title,
            imageUrl: post.imageUrl,
            error: error.nativeEvent
          });
        }}
        onLoad={() => {
          console.log('PostCard 이미지 로드 성공:', {
            postId: post.postId,
            title: post.title,
            imageUrl: post.imageUrl
          });
        }}
      />
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
