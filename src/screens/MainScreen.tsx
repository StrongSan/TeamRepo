// MainScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar } from "react-native";
import TitleSection from "../components/TitleSection";
import SearchBar from "../components/SearchBar";
import GridLayout from "../components/GridLayout";
import CustomerBottomBar from "../components/CustomerBottomBar";
import SellerBottomBar from "../components/SellerBottomBar";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { fetchAllPosts } from "../api/postAPI"; // ✅ 추가

type MainScreenRouteProp = RouteProp<RootStackParamList, "MainScreen">;

const MainScreen: React.FC = () => {
  const route = useRoute<MainScreenRouteProp>();
  const { userType } = route.params || {};

  // ✅ 추가: 게시글 상태 정의
  const [posts, setPosts] = useState([]);

  // ✅ 추가: 게시글 불러오기
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("게시글 불러오기 실패", error);
      }
    };

    loadPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TitleSection />
        <SearchBar />
        <GridLayout posts={posts} /> {/* ✅ 추가: 게시글 전달 */}
      </ScrollView>
      {userType === "seller" ? <SellerBottomBar /> : <CustomerBottomBar />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  mainContainer: {
    width: "100%",
    maxWidth: 390,
    position: "relative",
    flex: 1,
  },
});

export default MainScreen;
