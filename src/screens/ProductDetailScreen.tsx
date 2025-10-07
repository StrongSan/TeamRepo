import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Text, FlatList, Image, ActivityIndicator, Alert } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import SellerHeader from "../components/SellerHeader";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import ProductActionButtons from "../components/ProductActionButtons";
import Header from "../components/Header";
import { saveViewedCake } from "../api/postAPI";
import type { Post } from "../api/postAPI"; //  Post 타입 import
import { getReviewsByCake, getReviewSummaryByCake, ReviewResponse, ReviewSummary } from "../api/reviewAPI";

// 네비게이션 파라미터 타입 정의
type RootStackParamList = {
  ProductDetail: {
    userType: "seller" | "customer";
    post: Post;       // variantId 포함된 타입
    userId: string;   // 백엔드 전송용 userId
  };
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { userType, post, userId } = route.params;

  // 리뷰 관련 상태
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  // 진입 시 조회 기록 저장 (실패해도 다른 기능에 영향 없도록 처리)
  useEffect(() => {
    const saveViewHistory = async () => {
      try {
        // cakeId 우선 사용, 없으면 postId 사용
        await saveViewedCake(userId, post.cakeId || post.postId);
      } catch (error) {
        console.warn('조회 기록 저장 실패 (무시됨):', error);
        // 조회 기록 저장 실패는 사용자 경험에 영향을 주지 않으므로 무시
      }
    };
    
    saveViewHistory();
  }, [post.postId, userId]);

  // 리뷰 데이터 로드
  const loadReviews = useCallback(async (pageNum: number = 0, isRefresh: boolean = false) => {
    try {
      setLoading(true);
      
      // 디버깅: cakeId와 postId 값 확인
      console.log('🔍 리뷰 로드 디버깅:', {
        cakeId: post.cakeId,
        postId: post.postId,
        finalCakeId: post.cakeId || post.postId
      });
      
      // 리뷰 요약 정보 로드 (첫 페이지일 때만)
      if (pageNum === 0) {
        try {
          const summary = await getReviewSummaryByCake(post.cakeId || post.postId); // cakeId 우선, 없으면 postId 사용
          setReviewSummary(summary);
        } catch (error) {
          console.log('리뷰 요약 정보 로드 실패:', error);
        }
      }

      // 리뷰 목록 로드
      const response = await getReviewsByCake(post.cakeId || post.postId, pageNum, 10); // cakeId 우선, 없으면 postId 사용
      
      if (isRefresh) {
        setReviews(response.content || []);
      } else {
        setReviews(prev => [...prev, ...(response.content || [])]);
      }
      
      setHasNext(!response.last);
      setPage(pageNum);
    } catch (error) {
      console.error('리뷰 로드 실패:', error);
      Alert.alert('오류', '리뷰를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [post.postId]);

  // 초기 리뷰 로드
  useEffect(() => {
    loadReviews(0, true);
  }, [loadReviews]);

  // 무한 스크롤
  const loadMoreReviews = useCallback(() => {
    if (!loading && hasNext) {
      loadReviews(page + 1, false);
    }
  }, [loading, hasNext, page, loadReviews]);

  // 리뷰 아이템 렌더링
  const renderReviewItem = useCallback(({ item }: { item: ReviewResponse }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewRating}>
          {'★'.repeat(Math.floor(item.rating))}{'☆'.repeat(5 - Math.floor(item.rating))}
        </Text>
        <Text style={styles.reviewDate}>
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  ), []);

  console.log(" 조회 기록 저장 variantId:", post.variantId);
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
          userId={userId}
          postId={post.postId}
          cakeId={post.cakeId}
        />
        <ProductActionButtons userType={userType} postId={post.postId} userId={userId} price={post.price} />
        
        {/* 리뷰 섹션 */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>리뷰</Text>
          
          {/* 리뷰 요약 */}
          {reviewSummary && (
            <View style={styles.reviewSummary}>
              <Text style={styles.reviewSummaryText}>
                평점 {reviewSummary.avgRating.toFixed(1)} ({reviewSummary.count}개 리뷰)
              </Text>
            </View>
          )}

          {/* 리뷰 목록 */}
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.reviewId.toString()}
            renderItem={renderReviewItem}
            onEndReached={loadMoreReviews}
            onEndReachedThreshold={0.5}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyReviews}>
                <Text style={styles.emptyReviewsText}>아직 리뷰가 없습니다.</Text>
              </View>
            }
            ListFooterComponent={
              loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#E78182" />
                </View>
              ) : null
            }
          />
        </View>
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
  reviewSection: {
    width: "90%",
    maxWidth: 360,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  reviewSummary: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  reviewSummaryText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  reviewItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewRating: {
    fontSize: 16,
    color: "#f5a623",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  reviewComment: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  emptyReviews: {
    padding: 40,
    alignItems: "center",
  },
  emptyReviewsText: {
    fontSize: 14,
    color: "#999",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});

export default ProductDetailScreen;