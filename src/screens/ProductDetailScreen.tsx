import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import SellerHeader from "../components/SellerHeader";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import ProductActionButtons from "../components/ProductActionButtons";
import Header from "../components/Header";
import { saveViewedCake } from "../api/postAPI";
import type { Post } from "../api/postAPI"; // ✅ Post 타입 import

// ✅ 네비게이션 파라미터 타입 정의
type RootStackParamList = {
  ProductDetail: {
    userType: "seller" | "customer";
    post: Post;       // ✅ variantId 포함된 타입
    userId: number;   // ✅ 백엔드 전송용 userId
  };
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { userType, post, userId } = route.params;

  // ✅ 진입 시 조회 기록 저장
  useEffect(() => {
    saveViewedCake(userId, post.postId);
  }, [post.postId]);
  console.log("✅ 조회 기록 저장할 variantId:", post.variantId); // 꼭 확인

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SellerHeader />
        <ProductImage uri={post.imageUrl} />
        <ProductInfo
          title={post.title}
          price={post.price}
          description={post.description}
        />
        <ProductActionButtons userType={userType} postId={post.postId} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 0,
  },
});

export default ProductDetailScreen;
