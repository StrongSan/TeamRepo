import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import SellerHeader from "../components/SellerHeader";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import ProductActionButtons from "../components/ProductActionButtons";
import Header from "../components/Header";


// ✅ 변경: post 타입 정의
type Post = {
  postId: number;
  title: string;
  imageUrl: string;
  price: string;
  description: string;
};

type RootStackParamList = {
  ProductDetail: {
    userType: "seller" | "customer";
    post: Post; // ✅ 변경: post 전체 받기
  };
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { userType, post } = route.params; // ✅ 변경: post 구조분해

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SellerHeader />
        <ProductImage uri={post.imageUrl} /> {/* ✅ 변경: 이미지 표시 */}
        <ProductInfo
          title={post.title}
          price={post.price}
          description={post.description}
        /> {/* ✅ 변경: post 정보 렌더링 */}
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
  },
  scrollContent: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 0,
  },
});

export default ProductDetailScreen;
