import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomerBottomBar from '../components/CustomerBottomBar';
import SellerBottomBar from '../components/SellerBottomBar';

/** ───────────────────────── Types ───────────────────────── **/
type OrderStatus = 'IN_PROGRESS' | 'COMPLETED';

type OrderItem = {
  id: string;
  thumbnail: string;          // 이미지 URL
  title: string;              // 케이크명 혹은 주문 타이틀
  pickupDate: string;         // YYYY-MM-DD
  options: string;            // ex) '레터링 x1'
  price: number;              // 원화
  status: OrderStatus;
};

type Props = NativeStackScreenProps<RootStackParamList, 'MyReservations'>;

/** ─────────────────────── Mock Data (교체 예정) ─────────────────────── **/
const MOCK_ORDERS: OrderItem[] = [
  {
    id: 'o-1001',
    thumbnail: 'https://placehold.co/64x64',
    title: '픽업 대기 중',
    pickupDate: '2025-03-22',
    options: '베이비 x1',
    price: 48900,
    status: 'IN_PROGRESS',
  },
  {
    id: 'o-0901',
    thumbnail: 'https://placehold.co/64x64',
    title: '픽업 완료',
    pickupDate: '2025-04-10',
    options: '베이비 x1',
    price: 48900,
    status: 'COMPLETED',
  },
  {
    id: 'o-0900',
    thumbnail: 'https://placehold.co/64x64',
    title: '픽업 완료',
    pickupDate: '2025-02-12',
    options: '레터링 케이크 x1',
    price: 43000,
    status: 'COMPLETED',
  },
];

/** 날짜 포맷 유틸 */
const formatKRW = (n: number) => n.toLocaleString('ko-KR');

export default function MyReservationsScreen({ navigation, route }: Props) {
  const { userId, userType } = route.params;
  const [tab, setTab] = useState<OrderStatus>('IN_PROGRESS');
  const [refreshing, setRefreshing] = useState(false);

  // TODO: API에서 주문 목록 가져오기 (status별 페이지네이션)
  const orders = useMemo(
    () => MOCK_ORDERS.filter((o) => o.status === tab),
    [tab]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: API refetch
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: OrderItem }) => (
      <View style={styles.card}>
        <View style={styles.row}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
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
                onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
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
                onPress={() => navigation.navigate('WriteReview', { orderId: item.id })}
              />
            </>
          )}
        </View>
      </View>
    ),
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
        // TODO: onEndReached로 무한 스크롤 연결
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
});
