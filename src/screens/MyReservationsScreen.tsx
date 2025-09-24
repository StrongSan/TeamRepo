import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomerBottomBar from '../components/CustomerBottomBar';
import SellerBottomBar from '../components/SellerBottomBar';
import { getOrderListV2, OrderItem, OrderListResponse } from '../api/orderAPI';

/** ───────────────────────── Types ───────────────────────── **/
type OrderStatus = 'IN_PROGRESS' | 'COMPLETED';

type Props = NativeStackScreenProps<RootStackParamList, 'MyReservations'>;

/** ─────────────────────── State Management ─────────────────────── **/

/** 날짜 포맷 유틸 */
const formatKRW = (n: number) => n.toLocaleString('ko-KR');

export default function MyReservationsScreen({ navigation, route }: Props) {
  const { userId, userType } = route.params;
  const [tab, setTab] = useState<OrderStatus>('IN_PROGRESS');
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

      // API에서 주문 목록 가져오기
      const fetchOrders = useCallback(async (status: OrderStatus, pageNum: number = 0, isRefresh: boolean = false) => {
        try {
          setLoading(true);
          const response = await getOrderListV2(userId, status, pageNum, 10);
          
          console.log('주문 목록 응답:', JSON.stringify(response, null, 2));
          
          if (isRefresh) {
            setOrders(response.orders || []);
          } else {
            setOrders(prev => [...prev, ...(response.orders || [])]);
          }
          
          setHasNext(response.hasNext || false);
          setPage(pageNum);
        } catch (error) {
          console.error('주문 목록 조회 실패:', error);
          Alert.alert('오류', '주문 목록을 불러오는데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      }, [userId]);

  // 탭 변경 시 주문 목록 다시 가져오기
  useEffect(() => {
    setOrders([]);
    setPage(0);
    fetchOrders(tab, 0, true);
  }, [tab, fetchOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders(tab, 0, true);
    setRefreshing(false);
  }, [tab, fetchOrders]);

  const loadMore = useCallback(() => {
    if (!loading && hasNext) {
      fetchOrders(tab, page + 1, false);
    }
  }, [loading, hasNext, tab, page, fetchOrders]);

  const renderItem = useCallback(
    ({ item }: { item: OrderItem }) => {
      console.log('주문 아이템 이미지 URL:', item.thumbnail);
      return (
        <View style={styles.card}>
          <View style={styles.row}>
            <Image 
              source={{ 
                uri: item.thumbnail 
                  ? (item.thumbnail.startsWith('http') 
                      ? item.thumbnail 
                      : `http://172.30.176.1:8080/images/${item.thumbnail}`)
                  : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=64&h=64&fit=crop&crop=center'
              }} 
              style={styles.thumb}
              onError={(error) => {
                console.log('이미지 로드 실패:', error.nativeEvent.error);
                console.log('이미지 URL:', item.thumbnail);
                console.log('변환된 URL:', item.thumbnail 
                  ? (item.thumbnail.startsWith('http') 
                      ? item.thumbnail 
                      : `http://172.30.176.1:8080/images/${item.thumbnail}`)
                  : 'fallback');
              }}
              onLoad={() => console.log('이미지 로드 성공:', item.thumbnail)}
            />
            <View style={styles.infoCol}>
            <Text style={[styles.status, item.status === 'IN_PROGRESS' ? styles.badgePink : styles.badgeGray]}>
              {item.title}
            </Text>

            <View style={{ height: 6 }} />

            <Text style={styles.metaLine}>
              <Text style={styles.metaLabel}>주문일자  </Text>
              {item.pickupDate}
            </Text>
            <Text style={styles.metaLine}>
              <Text style={styles.metaLabel}>주문내역  </Text>
              {item.options}
            </Text>
            <Text style={styles.metaLine}>
              <Text style={styles.metaLabel}>결제금액  </Text>
              {formatKRW(item.price)}
            </Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          {item.status === 'IN_PROGRESS' ? (
            <>
              <GhostButton
                label="주문상세"
                onPress={() => navigation.navigate('OrderDetail', { orderId: item.id, userId })}
              />
              <GhostButton
                label="문의하기"
                onPress={() => navigation.navigate('InquiryChat', { orderId: item.id })}
              />
            </>
          ) : (
            <>
              <GhostButton
                label="재주문"
                onPress={() => navigation.navigate('ReorderFlow', { orderId: item.id })}
              />
              <GhostButton
                label="후기 작성"
                onPress={() => navigation.navigate('WriteReview', { orderId: item.id, userId })}
              />
            </>
          )}
        </View>
      </View>
      );
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      {/* 헤더(네이티브 스택 헤더를 쓰면 제거 가능) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이 예약</Text>
      </View>

      {/* 탭 스위처 */}
      <View style={styles.tabRow}>
        <SegmentButton
          active={tab === 'IN_PROGRESS'}
          label="진행 중인 주문"
          onPress={() => setTab('IN_PROGRESS')}
        />
        <SegmentButton
          active={tab === 'COMPLETED'}
          label="지난 주문"
          onPress={() => setTab('COMPLETED')}
        />
      </View>

      {/* 리스트 */}
      <FlatList
        data={orders}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {tab === 'IN_PROGRESS' ? '진행 중인 주문이 없습니다.' : '지난 주문이 없습니다.'}
            </Text>
          </View>
        }
      />

      {/* 하단 네비게이션 바 */}
      {userType === 'customer' ? (
        <CustomerBottomBar userId={userId} />
      ) : (
        <SellerBottomBar userId={userId} />
      )}
    </View>
  );
}

/** ──────────────────────── UI Subcomponents ──────────────────────── **/
function SegmentButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segment, active ? styles.segmentActive : styles.segmentInactive]}
    >
      <Text style={[styles.segmentText, active ? styles.segmentTextActive : styles.segmentTextInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function GhostButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.ghostBtn}>
      <Text style={styles.ghostBtnText}>{label}</Text>
    </Pressable>
  );
}

/** ────────────────────────── Styles ────────────────────────── **/
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },

  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  segment: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  segmentActive: {
    backgroundColor: '#f6d8dc', // 연핑크
    borderColor: '#f6d8dc',
  },
  segmentInactive: {
    backgroundColor: '#fff',
    borderColor: '#e5e5ea',
  },
  segmentText: { fontSize: 13, fontWeight: '600' },
  segmentTextActive: { color: '#d9556a' },
  segmentTextInactive: { color: '#777' },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', gap: 12 },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#f2f2f2' },
  infoCol: { flex: 1 },

  status: { fontSize: 14, fontWeight: '700' },
  badgePink: { color: '#d9556a' }, // 진행중 뱃지 느낌
  badgeGray: { color: '#333' },    // 지난주문 타이틀

  metaLine: { fontSize: 12, color: '#333', marginTop: 2 },
  metaLabel: { color: '#9c9c9c' },

  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  ghostBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5ea',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  ghostBtnText: { fontSize: 13, color: '#333', fontWeight: '600' },

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
});
