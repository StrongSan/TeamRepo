import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import axios from "axios";

import SellerHeader from "../components/SellerHeader";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import ProductActionButtons from "../components/ProductActionButtons";
import Header from "../components/Header";

// ✅ post 타입 정의에 cakeId 포함
type Post = {
  postId: number;
  title: string;
  imageUrl: string;
  price: string;
  description: string;
  cakeId: number; // ✅ 조회 시 전송할 대상
};

type RootStackParamList = {
  ProductDetail: {
    userType: "seller" | "customer";
    post: Post;
  };
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { userType, post } = route.params;

  // ✅ 조회한 게시글의 cakeId를 백엔드에 전송 (조회 기록 등록용)
  useEffect(() => {
    const logCakeView = async () => {
      try {
        await axios.post("http://172.25.6.95/api/view-log", {
          cakeId: post.cakeId,
        });
        console.log("조회 기록 전송 완료");
      } catch (error) {
        console.error("조회 기록 전송 실패:", error);
      }
    };

    logCakeView(); // 컴포넌트 렌더링 시 자동 실행
  }, [post.cakeId]);

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
        <ProductActionButtons userType={userType} />
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
