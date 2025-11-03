import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getReviewsByUser, ReviewResponse, deleteReview, updateReview } from '../api/reviewAPI';

type Props = NativeStackScreenProps<RootStackParamList, 'MyReviews'>;

export default function MyReviewsScreen({ navigation, route }: Props) {
  const { userId } = route.params;
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  // 리뷰 데이터 로드
  const loadReviews = useCallback(async (pageNum: number = 0, isRefresh: boolean = false) => {
    try {
      setLoading(true);
      
      // 사용자가 작성한 리뷰 조회
      const response = await getReviewsByUser(parseInt(userId), pageNum, 10);
      
      if (isRefresh) {
        setReviews(response.content || []);
      } else {
        setReviews(prev => [...prev, ...(response.content || [])]);
      }
      
      setHasNext(!response.last);
      setPage(pageNum);
    } catch (error) {
      console.error('내 리뷰 로드 실패:', error);
      Alert.alert('오류', '리뷰를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 초기 리뷰 로드
  useEffect(() => {
    loadReviews(0, true);
  }, [loadReviews]);

  // 새로고침
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReviews(0, true);
    setRefreshing(false);
  }, [loadReviews]);

  // 무한 스크롤
  const loadMore = useCallback(() => {
    if (!loading && hasNext) {
      loadReviews(page + 1, false);
    }
  }, [loading, hasNext, page, loadReviews]);

  // 리뷰 삭제 처리
  const handleDeleteReview = useCallback(async (reviewId: number) => {
    Alert.alert(
      '리뷰 삭제',
      '정말로 이 리뷰를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReview(reviewId, parseInt(userId));
              Alert.alert('성공', '리뷰가 삭제되었습니다.');
              // 리뷰 목록 새로고침
              await loadReviews(0, true);
            } catch (error) {
              console.error('리뷰 삭제 실패:', error);
              Alert.alert('오류', '리뷰 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  }, [userId, loadReviews]);

  // 리뷰 수정 처리
  const handleEditReview = useCallback((review: ReviewResponse) => {
    // 리뷰 수정 화면으로 이동 (ReviewWriteScreen 재사용)
    navigation.navigate('WriteReview', {
      orderId: 'edit-mode', // 수정 모드를 위한 더미 orderId
      userId: userId,
      isEdit: true,
      existingReview: review,
    });
  }, [navigation, userId]);

  // 리뷰 아이템 렌더링
  const renderReviewItem = useCallback(({ item }: { item: ReviewResponse }) => (
    <View style={styles.reviewItem}>
      <TouchableOpacity 
        style={styles.reviewContent}
        onPress={async () => {
          try {
            console.log('리뷰 아이템 데이터:', item);
            console.log('cakeId:', item.cakeId, '타입:', typeof item.cakeId);
            
            if (!item.cakeId || item.cakeId === 'undefined') {
              Alert.alert('오류', '케이크 정보를 찾을 수 없습니다.');
              return;
            }
            
            // 케이크 ID로 게시글 정보 가져오기
            const { fetchPostById } = await import('../api/postAPI');
            const post = await fetchPostById(item.cakeId);
            
            // 디버깅: 게시글 정보 확인
            console.log('게시글 정보:', {
              cakeId: item.cakeId,
              postId: post.postId,
              title: post.title,
              imageUrl: post.imageUrl,
              variantId: post.variantId,
              imageUrlType: typeof post.imageUrl,
              imageUrlLength: post.imageUrl?.length
            });
            
            // ProductDetail 화면으로 이동
            navigation.navigate('ProductDetail', {
              userType: 'customer', // 리뷰 작성자는 customer
              post: {
                postId: post.postId,
                title: post.title,
                imageUrl: post.imageUrl,
                price: post.price,
                description: post.description,
                variantId: post.variantId,
                cakeId: item.cakeId, // 리뷰의 cakeId 사용 (1)
                sheetId: post.sheetId,
                fillingId: post.fillingId,
                sizeId: post.sizeId,
                typeId: post.typeId,
              },
              userId: userId,
            });
          } catch (error) {
            console.error('게시글 정보 가져오기 실패:', error);
            Alert.alert('오류', '게시글 정보를 불러올 수 없습니다.');
          }
        }}
      >
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewRating}>
            {'★'.repeat(Math.floor(item.rating))}{'☆'.repeat(5 - Math.floor(item.rating))}
          </Text>
          <Text style={styles.reviewDate}>
            {new Date(item.createdAt).toLocaleDateString('ko-KR')}
          </Text>
        </View>
        <Text style={styles.reviewComment}>{item.comment}</Text>
        <View style={styles.reviewFooter}>
          <Text style={styles.reviewCakeId}>케이크 ID: {item.cakeId}</Text>
        </View>
      </TouchableOpacity>
      
      {/* 삭제/수정 버튼 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleEditReview(item)}
        >
          <Text style={styles.editButtonText}>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteReview(item.reviewId)}
        >
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [navigation, userId, handleDeleteReview, handleEditReview]);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 리뷰</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 리뷰 목록 */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.reviewId.toString()}
        renderItem={renderReviewItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>작성한 리뷰가 없습니다.</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  listContent: {
    padding: 16,
  },
  reviewItem: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reviewContent: {
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewRating: {
    fontSize: 16,
    color: '#f5a623',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewCakeId: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f6d8dc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#d9556a',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#E78182',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
