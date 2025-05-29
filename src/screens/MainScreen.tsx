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
import GridItem from "../components/PostCard"; // ✅ 게시글 카드 컴포넌트
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
} from "../api/postAPI";

type MainScreenRouteProp = RouteProp<RootStackParamList, "MainScreen">;

const MainScreen: React.FC = () => {
  const route = useRoute<MainScreenRouteProp>();
  const { userType } = route.params || {};
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1); // ✅ 페이징
  const [loadingMore, setLoadingMore] = useState(false);

  const loadInitialPosts = async () => {
    try {
      const data = await fetchAllPosts(); // 초기 로딩
      setPosts(data);
    } catch (error) {
      console.error("게시글 불러오기 실패", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const cakeIds = await fetchRecommendedCakeIds();
      const recommendedPosts = await fetchPostsByCakeIds(cakeIds);
      setPosts(recommendedPosts);
    } catch (error) {
      console.error("추천 게시글 불러오기 실패", error);
    } finally {
      setRefreshing(false);
    }
  };

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
    loadInitialPosts();
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
          item && (
            <GridItem post={item} /> // ✅ PostCard로 각 게시글 렌더링
          )
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
