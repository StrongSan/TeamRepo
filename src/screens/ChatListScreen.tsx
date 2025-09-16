import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

// 👉 실제 데이터로 교체하세요.
type ChatPreview = {
  id: string;
  name: string;
  lastMessage: string;
  unread?: number;
};

const DUMMY: ChatPreview[] = [
  { id: '1', name: '이민영', lastMessage: '이 시간으로 변경하고 싶어요 ㅠㅠ', unread: 3 },
  { id: '2', name: '김강산', lastMessage: '주문서 작성해주시면 됩니다~' },
  { id: '3', name: '박민지', lastMessage: '네 감사합니다', unread: 1 },
  { id: '4', name: '김진서', lastMessage: '네 가능합니다~' },
  { id: '5', name: '어건우', lastMessage: '감사합니다^^' },
];

type ChatListScreenRouteProp = RouteProp<RootStackParamList, 'ChatList'>;

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ChatListScreenRouteProp>();
  const { userId, userType } = route.params;
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim();
    if (!q) return DUMMY;
    return DUMMY.filter(
      (r) => r.name.includes(q) || r.lastMessage.includes(q)
    );
  }, [query]);

  const renderItem = ({ item }: { item: ChatPreview }) => (
    <Pressable
      onPress={() => {
        navigation.navigate('ChatRoom', { 
          roomId: item.id, 
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
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
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
      <FlatList
        data={list}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
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
  name: { fontSize: 14, fontWeight: '700', color: '#222' },
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

  sep: { height: 1, backgroundColor: '#f1f1f1', marginLeft: 70 },
});

export default ChatListScreen;
