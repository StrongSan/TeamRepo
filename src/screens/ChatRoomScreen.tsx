import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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
  AppState,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useChatWebSocket, buildStompFrame } from '../hooks/useChatWebSocket';
import { 
  getRecentMessages, 
  enterChatRoom, 
  syncReadStatus, 
  ChatMessage as ChatMessageType,
  uploadChatImage
} from '../api/chatAPI';
import { TokenManager } from '../utils/tokenManager';
import apiClient from '../api/apiClient';

// ====== 타입 정의 ======
type MsgType = 'TEXT' | 'IMAGE';

type ChatMsg = {
  id: string;
  msgId: number;
  type: MsgType;
  content?: string;
  imageUrl?: string;
  createdAt: string;
  mine: boolean;
  senderId: number;
};

// 날짜(YYYY-MM-DD) 라벨 계산
const toDateKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);

// ====== 화면 구성 ======
type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

const ChatRoomScreen: React.FC = () => {
  const route = useRoute<ChatRoomScreenRouteProp>();
  const navigation = useNavigation();
  const { roomId, userId, userType } = route.params;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const flatRef = useRef<FlatList<any>>(null);
  const appState = useRef(AppState.currentState);

  // 메시지 변환 함수
  const convertMessage = useCallback((msg: ChatMessageType): ChatMsg => {
    return {
      id: msg.msgId.toString(),
      msgId: msg.msgId,
      type: msg.contentType,
      content: msg.content, // 항상 content에 저장
      imageUrl: msg.contentType === 'IMAGE' ? msg.content : undefined,
      createdAt: msg.createdAt,
      mine: msg.senderId === parseInt(userId),
      senderId: msg.senderId,
    };
  }, [userId]);

  // 새 메시지 수신 핸들러
  const handleMessageReceived = useCallback((newMsg: ChatMessageType) => {
    console.log('🔍 Current user ID:', userId);
    console.log('🔍 Message sender ID:', newMsg.senderId);
    console.log('🔍 Message will be mine:', newMsg.senderId === parseInt(userId));
    
    const chatMsg = convertMessage(newMsg);
    console.log('🔍 Converted message mine:', chatMsg.mine);
    setMessages(prev => [...prev, chatMsg]);

    // 스크롤이 맨 밑이면 자동 스크롤, 아니면 배지 표시
    if (isNearBottom) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    } else if (!chatMsg.mine) {
      setNewMessageCount(prev => prev + 1);
    }
  }, [convertMessage, isNearBottom]);

  // WebSocket 연결
  const { isConnected, isConnecting, sendMessage, wsRef } = useChatWebSocket({
    roomId: parseInt(roomId),
    onMessageReceived: handleMessageReceived,
  });

  // 연결 상태 로그
  useEffect(() => {
    console.log('WebSocket 연결 상태:', { isConnected, isConnecting });
    
    // ✅ 이미지 전송 시 WebSocket 연결 상태 확인
    if (!isConnected && !isConnecting) {
      console.warn('⚠️ WebSocket 연결되지 않음 - 이미지 전송 후 수신 불가능');
    }
  }, [isConnected, isConnecting]);

  // 초기 메시지 로드
  useEffect(() => {
    loadInitialMessages();
  }, [roomId]);

  const loadInitialMessages = async () => {
    try {
      setLoading(true);
      
      console.log('채팅방 입장 처리 시작:', roomId);
      
      // 방 입장 처리
      try {
        const latestMsgId = await enterChatRoom(parseInt(roomId));
        console.log('✅ 채팅방 입장 완료, 최신 메시지 ID:', latestMsgId);
      } catch (enterError: any) {
        console.error('❌ 채팅방 입장 실패:', enterError);
        console.error('❌ 입장 오류 상세:', {
          status: enterError.response?.status,
          data: enterError.response?.data,
          message: enterError.message
        });
        
        // 입장 실패 시 사용자에게 알림
        Alert.alert('오류', '채팅방 입장에 실패했습니다. 다시 시도해주세요.');
        navigation.goBack();
        return;
      }
      
      // 최근 30개 메시지 로드
      const recentMessages = await getRecentMessages(parseInt(roomId));
      console.log('메시지 로드 완료:', recentMessages.length, '개');
      
      const convertedMessages = recentMessages.map(convertMessage);
      setMessages(convertedMessages);
      
      // 맨 아래로 스크롤
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 100);
    } catch (error: any) {
      console.error('메시지 로드 실패:', error);
      console.error('에러 상세:', error.response?.data || error.message);
      Alert.alert('오류', '메시지를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 스크롤 위치 감지
  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    setIsNearBottom(isBottom);
    
    // 맨 밑으로 스크롤하면 새 메시지 배지 숨김
    if (isBottom) {
      setNewMessageCount(0);
    }
  }, []);

  // 새 메시지 배지 클릭 시 맨 아래로 스크롤
  const scrollToBottom = useCallback(() => {
    flatRef.current?.scrollToEnd({ animated: true });
    setNewMessageCount(0);
  }, []);

  // 앱 포그라운드 전환 시 read-sync
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // 포그라운드로 전환됨
        console.log('앱이 포그라운드로 전환됨 - read-sync 실행');
        
        if (messages.length > 0) {
          const lastMsgId = messages[messages.length - 1].msgId;
          try {
            await syncReadStatus(parseInt(roomId), lastMsgId);
          } catch (error) {
            console.error('read-sync 실패:', error);
          }
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [roomId, messages]);

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

    // WebSocket을 통해 메시지 전송
    if (isConnected) {
      sendMessage(text, 'TEXT');
      setInput('');
      
      // 맨 아래로 스크롤
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    } else {
      Alert.alert('오류', '채팅 서버와 연결되지 않았습니다.');
    }
  };

  const onPressPlus = () => {
    console.log('📷 이미지 선택 시작');
    
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as const,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('📷 이미지 선택 취소');
        return;
      }

      if (response.errorMessage) {
        console.error('📷 이미지 선택 오류:', response.errorMessage);
        Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          console.log('📷 선택된 이미지:', asset.uri);
          sendImageMessage(asset.uri);
        }
      }
    });
  };

  const sendImageMessage = async (imageUri: string) => {
    try {
      console.log('📤 이미지 업로드 시작:', imageUri);
      
      // 1. 이미지를 서버에 업로드
      const uploadedImageUrl = await uploadChatImage(imageUri);
      console.log('✅ 이미지 업로드 완료:', uploadedImageUrl);
      
      // 2. HTTP API를 사용하여 메시지 전송 (WebSocket 대신)
      const messageData = {
        content: uploadedImageUrl,
        contentType: 'IMAGE',
      };

      // 토큰 정보 확인
      const token = await TokenManager.getAccessToken();
      console.log('🔑 현재 토큰:', token ? `${token.substring(0, 20)}...` : '없음');
      console.log('👤 현재 사용자 ID:', userId);
      
      console.log('📨 메시지 전송 요청:', {
        roomId,
        messageData,
        url: `/api/chat/rooms/${roomId}/send`,
        token: token ? `${token.substring(0, 20)}...` : '없음'
      });

      const response = await apiClient.post(`/api/chat/rooms/${roomId}/send`, messageData);

      if (response.status === 200) {
        console.log('✅ 이미지 메시지 전송 완료 (HTTP API)');
        
        // ✅ 전송된 메시지를 로컬 상태에 즉시 추가
        const responseData = response.data;
        console.log('📨 서버 응답:', responseData);
        
        if (responseData.msgId && responseData.content && responseData.contentType && responseData.createdAt && responseData.senderId) {
          const chatMessage: ChatMessageType = {
            msgId: responseData.msgId,
            roomId: parseInt(roomId),
            senderId: responseData.senderId,
            content: responseData.content,
            contentType: responseData.contentType,
            createdAt: responseData.createdAt,
          };
          
          const chatMsg = convertMessage(chatMessage);
          setMessages(prev => [...prev, chatMsg]);
          console.log('✅ 이미지 메시지 로컬 상태에 추가됨');
          
          // 맨 아래로 스크롤
          setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
        }
        
        // 입력창 초기화
        setInput('');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('❌ 이미지 전송 실패:', error);
      
      // 더 자세한 오류 정보 로깅
      if (error.response) {
        console.error('📋 서버 응답 오류:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: {
            'content-type': error.response.headers['content-type'],
            'www-authenticate': error.response.headers['www-authenticate'],
            'authorization': error.response.headers['authorization']
          }
        });
        
        // 응답 데이터가 문자열인 경우 파싱 시도
        if (typeof error.response.data === 'string' && error.response.data) {
          try {
            const parsedData = JSON.parse(error.response.data);
            console.error('📋 파싱된 오류 데이터:', parsedData);
          } catch (e) {
            console.error('📋 원본 오류 데이터 (JSON 파싱 실패):', error.response.data);
          }
        }
      } else if (error.request) {
        console.error('📋 요청 오류 (서버 응답 없음):', error.request);
      } else {
        console.error('📋 기타 오류:', error.message);
      }
      
      const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류';
      Alert.alert('오류', '이미지 전송에 실패했습니다: ' + errorMessage);
    }
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
    const isImage = item.type === 'IMAGE';
    
    console.log('🔍 메시지 렌더링:', {
      id: item.id,
      type: item.type,
      isImage: isImage,
      content: item.content?.substring(0, 50) + '...',
      mine: mine
    });

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
              source={{ 
                uri: item.content,
                cache: 'force-cache' // 캐시 강제 사용
              }}
              style={styles.imageBubble}
              resizeMode="cover"
              onLoad={() => {
                console.log('✅ 이미지 로드 성공:', item.content);
                console.log('✅ 이미지 URL 형식 확인:', {
                  url: item.content,
                  isFilesPath: item.content.includes('/files/'),
                  isApiPath: item.content.includes('/api/chat/images/')
                });
              }}
              onError={(error) => {
                console.error('❌ 이미지 로드 실패:', item.content);
                console.error('❌ 오류 상세:', error.nativeEvent.error);
                console.error('❌ 오류 타입:', typeof error.nativeEvent.error);
                
                // ✅ 이미지 URL 경로 확인 및 수정 제안
                console.log('🔍 이미지 URL 분석:', {
                  originalUrl: item.content,
                  isFilesPath: item.content.includes('/files/'),
                  isApiPath: item.content.includes('/api/chat/images/'),
                  expectedFormat: `${apiClient.defaults.baseURL}/files/{filename}`,
                  urlParts: item.content.split('/'),
                  filename: item.content.split('/').pop()
                });
                
                // ✅ 네트워크 상태 확인
                console.log('🌐 네트워크 상태 확인:', {
                  isLocalhost: item.content.includes('10.0.2.2'),
                  isHttp: item.content.startsWith('http://'),
                  isHttps: item.content.startsWith('https://')
                });
                
                // ✅ 백엔드에서 올바른 URL 생성하므로 추가 수정 불필요
                console.log('🔧 이미지 로드 실패 - 백엔드 직접 파일 서빙 엔드포인트 확인 필요');
              }}
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
        {isConnecting && <ActivityIndicator size="small" color="#E78182" />}
        {isConnected && <View style={styles.connectedDot} />}
      </View>

      {/* 메시지 영역 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E78182" />
          <Text style={styles.loadingText}>메시지를 불러오는 중...</Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatRef}
            data={listWithDateSeparators}
            keyExtractor={(it) => it.id}
            renderItem={renderRow}
            contentContainerStyle={styles.listContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
          
          {/* 새 메시지 배지 */}
          {newMessageCount > 0 && !isNearBottom && (
            <TouchableOpacity style={styles.newMessageBadge} onPress={scrollToBottom}>
              <Text style={styles.newMessageText}>새 메시지 {newMessageCount}개 ↓</Text>
            </TouchableOpacity>
          )}
        </>
      )}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#222' },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
  },

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
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  
  // 로딩 스타일
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  
  // 새 메시지 배지
  newMessageBadge: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#E78182',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newMessageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ChatRoomScreen;
