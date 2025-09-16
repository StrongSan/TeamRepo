import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

// ====== 타입 & 더미 ======
type MsgType = 'text' | 'image';

type ChatMsg = {
  id: string;
  type: MsgType;
  content?: string;     // text일 때
  imageUrl?: string;    // image일 때
  createdAt: string;    // ISO
  mine?: boolean;       // 내가 보낸 메시지
};

const DUMMY: ChatMsg[] = [
  { id: 'm1', type: 'text', content: '안녕하세요! 케이기 입니다.\n문의내용을 적어주세요.', createdAt: '2025-03-27T09:00:00Z', mine: false },
  { id: 'm2', type: 'text', content: '안녕하세요! 케이크를 주문하려는데 사장님 페이지에 있는 디자인들로만 주문 가능한지 여쭤보고 싶습니다.', createdAt: '2025-03-27T09:01:10Z', mine: true },
  { id: 'm3', type: 'text', content: '우선 사진을 보내주시면 답변드리겠습니다!', createdAt: '2025-03-27T09:01:50Z', mine: false },
  { id: 'm4', type: 'image', imageUrl: 'https://via.placeholder.com/140x140.png', createdAt: '2025-03-27T09:02:40Z', mine: true },
  { id: 'm5', type: 'text', content: '이 디자인으로 하고싶습니다.\n가능할까요?', createdAt: '2025-03-27T09:02:45Z', mine: true },
  { id: 'm6', type: 'text', content: '가능합니다~^^ 주문서 작성해주세요.', createdAt: '2025-03-27T09:03:20Z', mine: false },
];

// 날짜(YYYY-MM-DD) 라벨 계산
const toDateKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);

// ====== 화면 구성 ======
type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

const ChatRoomScreen: React.FC = () => {
  const route = useRoute<ChatRoomScreenRouteProp>();
  const { roomId, userId, userType } = route.params;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const flatRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    setMessages(DUMMY);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 0);
  }, []);

  // 날짜 라벨 포함한 리스트로 변환
  const listWithDateSeparators = useMemo(() => {
    const result: Array<ChatMsg | { __date: string; id: string }> = [];
    let prevKey = '';
    messages.forEach((m) => {
      const k = toDateKey(m.createdAt);
      if (k !== prevKey) {
        result.push({ __date: k, id: `date-${k}-${result.length}` });
        prevKey = k;
      }
      result.push(m);
    });
    return result;
  }, [messages]);

  const onPressSend = () => {
    const text = input.trim();
    if (!text) return;

    const optimistic: ChatMsg = {
      id: `tmp-${Date.now()}`,
      type: 'text',
      content: text,
      createdAt: new Date().toISOString(),
      mine: true,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 20);

    // TODO: 실제 전송 로직 붙이기 (소켓/REST)
  };

  const onPressPlus = () => {
    // TODO: 이미지 선택 & 업로드 붙이기
    console.log('add image');
  };

  const renderRow = ({ item }: { item: any }) => {
    // 날짜 라벨
    if (item.__date) {
      const d = new Date(item.__date);
      const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      return (
        <View style={styles.dateWrap}>
          <Text style={styles.dateText}>{label}</Text>
        </View>
      );
    }

    // 메시지 버블
    const mine = !!item.mine;
    const isImage = item.type === 'image';

    return (
      <View style={[styles.row, mine ? styles.right : styles.left]}>
        <View
          style={[
            styles.bubble,
            mine ? styles.myBubble : styles.otherBubble,
            isImage && styles.noPadding,
          ]}
        >
          {isImage ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.imageBubble}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.msgText}>{item.content}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 88, android: 0 })}
    >
      {/* 상단 헤더(네이티브 헤더 쓰면 제거) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>채팅방 {roomId}</Text>
      </View>

      {/* 메시지 영역 */}
      <FlatList
        ref={flatRef}
        data={listWithDateSeparators}
        keyExtractor={(it) => it.id}
        renderItem={renderRow}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
      />

      {/* 입력 바 */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.plusBtn} onPress={onPressPlus} activeOpacity={0.8}>
          <Text style={{ fontSize: 18, color: '#8f8f8f' }}>＋</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="메시지 입력"
          placeholderTextColor="#b5b5b5"
          value={input}
          onChangeText={setInput}
          multiline
        />

        <TouchableOpacity
          style={[styles.sendBtn, input.trim() ? styles.sendEnabled : null]}
          onPress={onPressSend}
          activeOpacity={0.85}
          disabled={!input.trim()}
        >
          <Text style={styles.sendIcon}>▶</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ====== 스타일 ======
const PINK = '#f0caca';
const PINK_DARK = '#e5a9a9';

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

  listContent: { paddingHorizontal: 16, paddingVertical: 12 },

  dateWrap: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#9a9a9a',
  },

  row: { flexDirection: 'row', marginVertical: 6 },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },

  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  myBubble: {
    backgroundColor: PINK,
    borderTopRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ececec',
    borderTopLeftRadius: 4,
  },
  noPadding: { paddingHorizontal: 0, paddingVertical: 0 },

  msgText: { fontSize: 14, color: '#222', lineHeight: 20 },

  imageBubble: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: 1,
    borderColor: '#f1f1f1',
  },
  plusBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 18,
    fontSize: 14,
    color: '#222',
    backgroundColor: '#fff',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f1b6b6', // 비활성 톤
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendEnabled: {
    backgroundColor: PINK_DARK,
  },
  sendIcon: { color: '#fff', fontSize: 14, fontWeight: '700' },
});

export default ChatRoomScreen;
