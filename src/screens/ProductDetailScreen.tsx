import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native"; 

import SellerHeader from "../components/SellerHeader";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import ProductActionButtons from "../components/ProductActionButtons";
import Header from "../components/Header";

type RootStackParamList = {
  ProductDetail: { userType: "seller" | "customer" };
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { userType } = route.params; 

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SellerHeader />
        <ProductImage />
        <ProductInfo
          title="유아용 케이크"
          price="50,000 ~"
          description="유아용으로 만든 로보카폴리 케이크에요 ~^^\n피규어는 직접 보내주셔야 합니다.\n궁금하신 건 문의주세요~"
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
  },
  scrollContent: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 0,
  },
});

export default ProductDetailScreen;
