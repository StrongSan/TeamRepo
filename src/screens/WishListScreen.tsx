import React, { useMemo, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Alert, RefreshControl, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import CustomerBottomBar from '../components/CustomerBottomBar';
import SellerBottomBar from '../components/SellerBottomBar';
import { getFavoriteList, removeFavorite } from '../api/favoriteAPI';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BASE_URL } from '../api/config';

// ⚠️ 프로젝트의 실제 아이콘 경로에 맞게 수정하세요.
import AllowLeft from '../../assets/icons/allowLeft.svg';
import HeartFilledIcon from '../../assets/icons/heart-filled.svg';

const GAP = 14;              // 카드 사이 간격
const PADDING_H = 12;        // 좌우 패딩
const RADIUS = 12;           // 카드 라운드
const PLACEHOLDER_BG = '#EFEFEF';
const HEADER_BG = '#FFFFFF';

type WishListRouteProp = RouteProp<RootStackParamList, 'WishList'>;

interface FavoriteItem {
  id: number;
  createdAt: string;
  cakeId: number;
  title: string;
  imageUrl: string;
  price: string;
}

const WishListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<WishListRouteProp>();
  const { userId, userType } = route.params;
  
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 화면 폭을 기준으로 2열 정사각형 카드 크기 계산
  const itemSize = useMemo(() => {
    const W = Dimensions.get('window').width;
    const totalHorizontal = PADDING_H * 2 + GAP; // 좌우 패딩 + 카드 사이 간격 1번
    return Math.floor((W - totalHorizontal) / 2);
  }, []);

  // 찜 목록 불러오기
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavoriteList(userId);
      console.log('🔍 찜 목록 API 응답:', {
        responseType: typeof response,
        hasContent: !!response.content,
        contentLength: response.content?.length || 0,
        firstItem: response.content?.[0] || response[0]
      });
      
      if (response.content) {
        setFavorites(response.content);
      } else {
        setFavorites(response);
      }
    } catch (error) {
      console.error("찜 목록 불러오기 실패:", error);
      Alert.alert("오류", "찜 목록을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 새로고침
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  // 찜 제거
  const handleRemoveFavorite = async (favoriteId: number, cakeId: number) => {
    try {
      await removeFavorite(userId, cakeId);
      setFavorites(prev => prev.filter(item => item.id !== favoriteId));
      Alert.alert("성공", "찜이 제거되었습니다.");
    } catch (error) {
      console.error("찜 제거 실패:", error);
      Alert.alert("오류", "찜을 제거하는 중 문제가 발생했습니다.");
    }
  };

  // 컴포넌트 마운트 시 찜 목록 로드
  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity 
      style={[styles.card, { width: itemSize, height: itemSize }]}
      onPress={() => {
        // ProductDetail로 이동
        navigation.navigate("ProductDetail", {
          userType,
          userId,
          post: {
            postId: item.cakeId,
            title: item.title,
            imageUrl: item.imageUrl,
            price: item.price,
            description: ""
          }
        });
      }}
    >
      <View style={styles.cardContent}>
        {/* 케이크 이미지 추가 */}
        <Image
          source={{ 
            uri: item.imageUrl 
              ? (item.imageUrl.startsWith('http') 
                  ? item.imageUrl 
                  : `${BASE_URL}/images/${item.imageUrl}`)
              : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop&crop=center'
          }}
          style={styles.cakeImage}
          resizeMode="cover"
          defaultSource={require('../../assets/images/pre_cho1.jpg')} // 기본 이미지
          onError={(error) => {
            console.log('❌ 찜 목록 이미지 로드 실패:', {
              cakeId: item.cakeId,
              title: item.title,
              originalImageUrl: item.imageUrl,
              transformedImageUrl: item.imageUrl 
                ? (item.imageUrl.startsWith('http') 
                    ? item.imageUrl 
                    : `${BASE_URL}/images/${item.imageUrl}`)
                : 'fallback',
              error: error.nativeEvent
            });
          }}
          onLoad={() => {
            console.log('✅ 찜 목록 이미지 로드 성공:', {
              cakeId: item.cakeId,
              title: item.title,
              imageUrl: item.imageUrl 
                ? (item.imageUrl.startsWith('http') 
                    ? item.imageUrl 
                    : `${BASE_URL}/images/${item.imageUrl}`)
                : 'fallback'
            });
          }}
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardPrice}>
            {Number(item.price).toLocaleString()}원
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item.id, item.cakeId)}
        >
          <HeartFilledIcon width={20} height={20} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.headerWrap}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AllowLeft width={18} height={18} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>찜 목록</Text>
        <View style={{ width: 18 + 12 }} /> 
      </View>

      {/* 찜 목록 */}
      {favorites.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ gap: GAP }}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 찜한 케이크가 없습니다.</Text>
          <Text style={styles.emptySubText}>마음에 드는 케이크를 찜해보세요!</Text>
        </View>
      )}
      
      {/* 하단 바 - userType에 따라 다르게 표시 */}
      {userType === 'customer' ? (
        <CustomerBottomBar userId={userId} />
      ) : (
        <SellerBottomBar userId={userId} />
      )}
    </SafeAreaView>
  );
};

export default WishListScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerWrap: {
    backgroundColor: HEADER_BG,
    paddingHorizontal: PADDING_H,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  listContainer: {
    paddingHorizontal: PADDING_H,
    paddingTop: 10,
    paddingBottom: 12,
  },
  card: {
    backgroundColor: PLACEHOLDER_BG,
    borderRadius: RADIUS,
    overflow: 'hidden', // 이미지가 카드 경계를 벗어나지 않도록
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  removeButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  cakeImage: {
    width: '100%',
    height: '60%', // 이미지 높이를 카드 높이의 60%로 설정
    borderRadius: 8,
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
