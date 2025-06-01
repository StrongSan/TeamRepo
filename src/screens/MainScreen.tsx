// ✅ MainScreen.tsx (수정 완료본)
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
} from "react-native";

import TitleSection from "../components/TitleSection";
import SearchBar from "../components/SearchBar";
import GridItem from "../components/PostCard";
import CustomerBottomBar from "../components/CustomerBottomBar";
import SellerBottomBar from "../components/SellerBottomBar";

import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";
import type { Post } from "../api/postAPI";

import {
  fetchAllPosts,
  fetchRecommendedPostsByUserId,
} from "../api/postAPI";

// ✅ 타입 정의
type MainScreenRouteProp = RouteProp<RootStackParamList, "MainScreen">;

const MainScreen: React.FC = () => {
  const route = useRoute<MainScreenRouteProp>();
  const { userType, userId } = route.params || {}; // ✅ userId도 route에서 받음

  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // 🔁 새로고침 시 호출되는 함수
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const recommendedPosts = await fetchRecommendedPostsByUserId(userId);
      setPosts(recommendedPosts);
    } catch (error) {
      console.error("추천 게시글 불러오기 실패", error);
    } finally {
      setRefreshing(false);
    }
  };

  // 🔽 무한스크롤용 추가 게시글 로딩
  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchAllPosts();
      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post.postId));
        const newUnique = data.filter((post) => !existingIds.has(post.postId));
        return [...prev, ...newUnique];
      });
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error("추가 로딩 실패", e);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    onRefresh(); // 앱 시작 시 자동 로딩
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <FlatList
        data={posts}
        keyExtractor={(item, index) =>
          item?.postId ? item.postId.toString() : `post-${index}`
        }
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View>
            <TitleSection />
            <SearchBar />
          </View>
        }
        renderItem={({ item }) =>
          item && <GridItem post={item} userType={userType} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      {userType === "seller" ? <SellerBottomBar /> : <CustomerBottomBar />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
});

export default MainScreen;
