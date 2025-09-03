import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import HeartIcon from "../../assets/icons/heart-outline.svg";
import HeartFilledIcon from "../../assets/icons/heart-filled.svg";
import { toggleFavorite, checkFavorite } from "../api/favoriteAPI";

interface ProductInfoProps {
  title: string;
  price: string;
  description: string;
  userId: string;
  postId: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  title, 
  price, 
  description, 
  userId, 
  postId 
}) => {
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트 마운트 시 찜 상태 확인
  useEffect(() => {
    checkFavoriteStatus();
  }, [userId, postId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await checkFavorite(userId, postId);
      setLiked(response.favorited || false);
    } catch (error) {
      console.error("찜 상태 확인 실패:", error);
    }
  };

  const handleToggleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await toggleFavorite(userId, postId);
      setLiked(response.favorited || false);
    } catch (error) {
      console.error("찜 토글 실패:", error);
      Alert.alert("오류", "찜 기능을 처리하는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
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

        <TouchableOpacity 
          onPress={handleToggleLike} 
          style={styles.heartButton}
          disabled={isLoading}
        >
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
