import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";

import TitleSection from "../components/TitleSection";
import SearchBar from "../components/SearchBar";
import GridLayout from "../components/GridLayout";
import CustomerBottomBar from "../components/CustomerBottomBar";
import SellerBottomBar from "../components/SellerBottomBar";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";
import type { Post } from "../api/postAPI";

import {
  fetchAllPosts,
  fetchRecommendedCakeIds,
  fetchPostsByCakeIds,
} from "../api/postAPI"; // ✅ API 함수들 가져오기

type MainScreenRouteProp = RouteProp<RootStackParamList, "MainScreen">;

const MainScreen: React.FC = () => {
  const route = useRoute<MainScreenRouteProp>();
  const { userType } = route.params || {};
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false); // ✅ 새로고침 상태

  // ✅ 최초 로딩 시 전체 게시글 불러오기
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchAllPosts(); // cakeId 포함된 게시글 리스트
        setPosts(data);
      } catch (error) {
        console.error("게시글 불러오기 실패", error);
      }
    };

    loadPosts();
  }, []);

  // ✅ 새로고침 시 추천 게시글만 보여주기
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const cakeIds = await fetchRecommendedCakeIds(); // 추천 cakeId 리스트
      const recommendedPosts = await fetchPostsByCakeIds(cakeIds); // cakeId로 게시글 정보 가져오기
      setPosts(recommendedPosts); // 메인화면 갱신
    } catch (error) {
      console.error("추천 게시글 불러오기 실패", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={ 
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TitleSection />
        <SearchBar />
        <GridLayout posts={posts} /> 
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