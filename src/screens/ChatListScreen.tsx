import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { createOrGetChatRoom, getChatRooms } from '../api/chatAPI';

// 실제 채팅방 데이터 타입
type RealChatPreview = {
  roomId: number;
  otherUserId: number;
  otherUserNickname: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  lastMessageType: string;
};

// ✅ 통합된 채팅방 타입 (더미 데이터 제거)
type ChatPreview = {
  id: string;
  roomId: string;
  name: string;
  lastMessage: string;
  unread?: number;
  sellerId?: number;
  isReal?: boolean; // 실제 데이터인지 구분
};

type ChatListScreenRouteProp = RouteProp<RootStackParamList, 'ChatList'>;

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ChatListScreenRouteProp>();
  const { userId, userType } = route.params;
  const [query, setQuery] = useState('');
  const [realChatRooms, setRealChatRooms] = useState<RealChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  // 실제 채팅방 데이터 로드
  useEffect(() => {
    const loadRealChatRooms = async () => {
      try {
        setLoading(true);
        const rooms = await getChatRooms(parseInt(userId));
        
        // ✅ 사용자별 채팅방 필터링 확인
        console.log('✅ 실제 채팅방 데이터 로드 완료:', {
          userId: userId,
          roomCount: rooms.length,
          rooms: rooms.map(room => ({
            roomId: room.roomId,
            otherUserId: room.otherUserId,
            otherUserNickname: room.otherUserNickname
          }))
        });
        
        setRealChatRooms(rooms);
      } catch (error) {
        console.error('❌ 실제 채팅방 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRealChatRooms();
  }, [userId]);

  // 실제 데이터를 통합된 형태로 변환
  const convertRealToChatPreview = (real: RealChatPreview): ChatPreview => ({
    id: `real-${real.roomId}`,
    roomId: real.roomId.toString(),
    name: real.otherUserNickname,
    lastMessage: real.lastMessage,
    unread: real.unreadCount > 0 ? real.unreadCount : undefined,
    isReal: true,
  });

  // ✅ 더미 데이터 변환 함수 제거 (실제 데이터만 사용)

  const list = useMemo(() => {
    // ✅ 실제 데이터만 사용 (더미 데이터 제거)
    const realChatPreviews = realChatRooms.map(convertRealToChatPreview);

    const q = query.trim();
    if (!q) return realChatPreviews;
    return realChatPreviews.filter(
      (r) => r.name.includes(q) || r.lastMessage.includes(q)
    );
  }, [query, realChatRooms]);

  const renderItem = ({ item }: { item: ChatPreview }) => (
    <Pressable
      onPress={() => {
        navigation.navigate('ChatRoom', { 
          roomId: item.roomId, 
          userId, 
          userType 
        });
      }}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      {/* 아바타(회색 원) */}
      <View style={styles.avatar} />

      {/* 텍스트 영역 */}
      <View style={styles.textWrap}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {/* ✅ 실제 데이터 배지 제거 (이제 모든 데이터가 실제 데이터) */}
        </View>
        <Text style={styles.last} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {/* 미읽음 뱃지 */}
      {item.unread ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unread}</Text>
        </View>
      ) : null}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 라인 (네이티브 헤더를 쓰는 경우 제거) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>메시지</Text>
      </View>

      {/* 검색 박스 */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="검색"
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#b8b8b8"
        />
      </View>

      {/* 리스트 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PINK} />
          <Text style={styles.loadingText}>채팅방을 불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

const PINK = '#e78282';
const LIGHT_PINK = '#f6d7d7';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#222' },

  searchWrap: {
    margin: 16,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f7f7f8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchIcon: { fontSize: 14, color: '#9a9a9a' },
  searchInput: { flex: 1, fontSize: 14, color: '#222' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#d9d9d9',
    marginRight: 12,
  },
  textWrap: { flex: 1 },
  nameRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  name: { fontSize: 14, fontWeight: '700', color: '#222', flex: 1 },
  realBadge: {
    fontSize: 10,
    color: PINK,
    backgroundColor: LIGHT_PINK,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  last: { fontSize: 13, color: '#7a7a7a', marginTop: 4 },

  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7a7a7a',
  },

  sep: { height: 1, backgroundColor: '#f1f1f1', marginLeft: 70 },
});

export default ChatListScreen;
