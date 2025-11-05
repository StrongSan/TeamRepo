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
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { 
  getRecentMessages, 
  enterChatRoom, 
  syncReadStatus, 
  ChatMessage as ChatMessageType,
  uploadChatImage
} from '../api/chatAPI';
import { TokenManager } from '../utils/tokenManager';
import apiClient from '../api/apiClient';
import ChatMessageBubble from '../components/ChatMessageBubble';
import ChatDateLabel from '../components/ChatDateLabel';
import { getMyProfile } from '../api/userAPI';

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
  isRead?: boolean; // 읽음 상태 (내 메시지일 때만)
  isOptimistic?: boolean; // Optimistic update로 추가된 임시 메시지인지
  optimisticContent?: string; // 임시 메시지의 원본 내용 (매칭용)
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
  const [bubbleContentWidths, setBubbleContentWidths] = useState<Map<number, number>>(new Map());
  const lastSyncedMsgIdRef = useRef<number | null>(null); // 마지막으로 동기화한 메시지 ID
  const readSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // 디바운스를 위한 타이머
  const [currentUserId, setCurrentUserId] = useState<number | null>(null); // 현재 로그인한 사용자 ID
  const initialLoadCompleteRef = useRef(false); // 초기 로드 완료 여부
  const pendingMessagesRef = useRef<ChatMessageType[]>([]); // currentUserId가 설정되기 전에 받은 메시지들

  // 읽음 상태 동기화 함수 (디바운스 적용)
  const performReadSync = useCallback((lastReadMsgId: number) => {
    // 이미 동기화한 메시지면 스킵
    if (lastSyncedMsgIdRef.current !== null && lastReadMsgId <= lastSyncedMsgIdRef.current) {
      return;
    }

    // 기존 타이머 취소
    if (readSyncTimeoutRef.current) {
      clearTimeout(readSyncTimeoutRef.current);
    }

    // 디바운스: 300ms 후 실행
    readSyncTimeoutRef.current = setTimeout(async () => {
      try {
        await syncReadStatus(parseInt(roomId), lastReadMsgId);
        lastSyncedMsgIdRef.current = lastReadMsgId;
      } catch (error) {
        console.error('read-sync 실패:', error);
      }
    }, 300);
  }, [roomId]);

  // 메시지 변환 함수
  const convertMessage = useCallback((msg: ChatMessageType): ChatMsg => {
    // 타입 변환: senderId와 currentUserId를 모두 number로 통일
    const msgSenderId = typeof msg.senderId === 'string' ? parseInt(msg.senderId, 10) : Number(msg.senderId);
    const myUserId = currentUserId !== null ? (typeof currentUserId === 'string' ? parseInt(currentUserId, 10) : Number(currentUserId)) : null;
    
    // 엄격한 비교: 타입과 값 모두 확인
    const isMine = myUserId !== null && !isNaN(msgSenderId) && !isNaN(myUserId) && msgSenderId === myUserId;
    
    // 디버깅 로그 (항상 출력)
    console.log('convertMessage:', {
      msgId: msg.msgId,
      senderId: msgSenderId,
      senderIdType: typeof msgSenderId,
      currentUserId: myUserId,
      currentUserIdType: typeof myUserId,
      isMine: isMine,
      comparison: `${msgSenderId} === ${myUserId}`,
      content: msg.content?.substring(0, 20)
    });
    
    return {
      id: msg.msgId.toString(),
      msgId: msg.msgId,
      type: msg.contentType,
      content: msg.content, // 항상 content에 저장
      imageUrl: msg.contentType === 'IMAGE' ? msg.content : undefined,
      createdAt: msg.createdAt,
      // 현재 로그인한 사용자 ID와 메시지 발신자 ID를 비교
      mine: isMine,
      senderId: msgSenderId,
      isRead: false, // 기본값: 읽지 않음
    };
  }, [currentUserId]);

  // 새 메시지 수신 핸들러
  const handleMessageReceived = useCallback((newMsg: ChatMessageType) => {
    console.log('handleMessageReceived 호출:', {
      msgId: newMsg.msgId,
      senderId: newMsg.senderId,
      content: newMsg.content?.substring(0, 20),
      contentType: newMsg.contentType,
      createdAt: newMsg.createdAt,
      currentUserId: currentUserId
    });
    
    // currentUserId가 설정되지 않았으면 메시지를 큐에 저장
    if (currentUserId === null) {
      console.log('currentUserId가 null, 메시지를 큐에 저장:', newMsg.msgId);
      pendingMessagesRef.current.push(newMsg);
      return;
    }
    
    const chatMsg = convertMessage(newMsg);
    
    setMessages(prev => {
      // 1. 같은 msgId의 메시지가 이미 있으면 무시 (최우선 체크)
      const existingByMsgId = prev.findIndex(msg => msg.msgId === chatMsg.msgId && !msg.isOptimistic);
      if (existingByMsgId !== -1) {
        console.log('중복 메시지 무시 (같은 msgId):', {
          msgId: chatMsg.msgId,
          content: chatMsg.content?.substring(0, 20)
        });
        return prev;
      }
      
      // 2. 내가 보낸 메시지이고, 같은 내용의 임시 메시지가 있으면 교체
      if (chatMsg.mine && currentUserId !== null) {
        // 최근 10초 이내에 보낸 임시 메시지 중 같은 내용 찾기
        const now = Date.now();
        const tempMsgIndex = prev.findIndex(msg => 
          msg.isOptimistic && 
          msg.optimisticContent === chatMsg.content &&
          msg.type === chatMsg.type &&
          Math.abs(now - msg.msgId) < 10000 // 10초 이내
        );
        
        if (tempMsgIndex !== -1) {
          // 임시 메시지를 서버 메시지로 교체
          const newMessages = [...prev];
          newMessages[tempMsgIndex] = chatMsg;
          console.log('임시 메시지를 서버 메시지로 교체:', {
            tempId: prev[tempMsgIndex].id,
            serverMsgId: chatMsg.msgId,
            content: chatMsg.content?.substring(0, 20)
          });
          return newMessages;
        }
      }
      
      // 3. 강력한 중복 체크: 같은 senderId, content, 그리고 비슷한 시간의 메시지가 있으면 무시
      // (모든 메시지에 적용 - 내 메시지와 상대방 메시지 모두)
      const newMsgTime = new Date(chatMsg.createdAt).getTime();
      const duplicateMsg = prev.find(msg => {
        if (msg.isOptimistic) return false; // 임시 메시지는 제외
        
        // 같은 발신자, 같은 내용, 같은 타입
        const sameSender = msg.senderId === chatMsg.senderId;
        const sameContent = msg.content === chatMsg.content;
        const sameType = msg.type === chatMsg.type;
        
        // 시간 차이가 3초 이내
        const msgTime = new Date(msg.createdAt).getTime();
        const timeDiff = Math.abs(newMsgTime - msgTime);
        const withinTimeWindow = timeDiff < 3000; // 3초 이내
        
        return sameSender && sameContent && sameType && withinTimeWindow;
      });
      
      if (duplicateMsg) {
        console.log('중복 메시지 무시 (같은 내용, 같은 발신자, 비슷한 시간):', {
          existingMsgId: duplicateMsg.msgId,
          newMsgId: chatMsg.msgId,
          senderId: chatMsg.senderId,
          content: chatMsg.content?.substring(0, 20),
          timeDiff: Math.abs(new Date(duplicateMsg.createdAt).getTime() - newMsgTime)
        });
        return prev; // 중복 메시지 무시
      }
      
      // 4. 새 메시지 추가
      console.log('새 메시지 추가:', {
        msgId: chatMsg.msgId,
        senderId: chatMsg.senderId,
        mine: chatMsg.mine,
        content: chatMsg.content?.substring(0, 20)
      });
      return [...prev, chatMsg];
    });

    // 스크롤이 맨 밑이면 자동 스크롤, 아니면 배지 표시
    if (isNearBottom) {
      setTimeout(() => {
        flatRef.current?.scrollToEnd({ animated: true });
        // 새 메시지 수신 시 하단에 붙어있으면 read-sync
        performReadSync(newMsg.msgId);
      }, 100);
    } else if (!chatMsg.mine) {
      setNewMessageCount(prev => prev + 1);
    }
  }, [convertMessage, isNearBottom, performReadSync, currentUserId]);

  // 읽음 상태 수신 핸들러 (READ_RECEIPT)
  const handleReadReceipt = useCallback((readerId: number, lastReadMsgId: number) => {
    
    // 상대방이 읽은 경우 (내 메시지만 업데이트)
    setMessages(prev => prev.map(msg => {
      // 내 메시지이고, 상대방이 읽은 메시지 ID 이하인 경우 읽음 처리
      if (msg.mine && msg.msgId <= lastReadMsgId) {
        return { ...msg, isRead: true };
      }
      return msg;
    }));
  }, []);

  // WebSocket 연결
  const { isConnected, isConnecting, sendMessage, wsRef } = useChatWebSocket({
    roomId: parseInt(roomId),
    onMessageReceived: handleMessageReceived,
    onReadReceipt: handleReadReceipt,
  });


  // 현재 로그인한 사용자 ID 가져오기 (화면 포커스 시마다 갱신)
  useFocusEffect(
    useCallback(() => {
      const fetchCurrentUserId = async () => {
        try {
          const profile = await getMyProfile();
          const userIdNumber = typeof profile.userId === 'string' ? parseInt(profile.userId) : profile.userId;
          console.log('ChatRoomScreen: 현재 사용자 ID 설정:', userIdNumber);
          setCurrentUserId(userIdNumber);
        } catch (error) {
          console.error('현재 사용자 ID 가져오기 실패:', error);
          // 실패 시 route.params.userId를 fallback으로 사용
          const fallbackUserId = parseInt(userId);
          console.log('ChatRoomScreen: Fallback 사용자 ID 사용:', fallbackUserId);
          setCurrentUserId(fallbackUserId);
        }
      };
      fetchCurrentUserId();
    }, [userId])
  );

  // currentUserId가 설정되면 기존 메시지들을 다시 변환하고 큐에 저장된 메시지 처리
  useEffect(() => {
    if (currentUserId !== null) {
      // 기존 메시지 재변환
      if (messages.length > 0) {
        console.log('ChatRoomScreen: currentUserId 설정됨, 기존 메시지 재변환:', currentUserId);
        setMessages(prev => prev.map(msg => {
          // 원본 ChatMessageType 형태로 재구성 (이미 변환된 메시지이므로)
          const msgSenderId = typeof msg.senderId === 'string' ? parseInt(msg.senderId) : msg.senderId;
          const myUserId = typeof currentUserId === 'string' ? parseInt(currentUserId) : currentUserId;
          const isMine = msgSenderId === myUserId;
          
          return {
            ...msg,
            mine: isMine
          };
        }));
      }
      
      // 큐에 저장된 메시지들 처리
      if (pendingMessagesRef.current.length > 0) {
        console.log('ChatRoomScreen: 큐에 저장된 메시지 처리:', pendingMessagesRef.current.length);
        const pending = [...pendingMessagesRef.current];
        pendingMessagesRef.current = []; // 큐 비우기
        
        pending.forEach(msg => {
          handleMessageReceived(msg);
        });
      }
    }
  }, [currentUserId, messages.length]);

  // 초기 메시지 로드
  useEffect(() => {
    if (currentUserId !== null) {
      console.log('ChatRoomScreen: currentUserId 설정됨, 메시지 로드 시작:', currentUserId);
      loadInitialMessages();
    } else {
      console.log('ChatRoomScreen: currentUserId가 null, 메시지 로드 대기 중...');
    }
  }, [roomId, currentUserId]);

  const loadInitialMessages = async () => {
    try {
      setLoading(true);
      
      // 방 입장 처리
      try {
        await enterChatRoom(parseInt(roomId));
      } catch (enterError: any) {
        console.error('채팅방 입장 실패:', enterError);
        console.error('입장 오류 상세:', {
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
      
      const convertedMessages = recentMessages.map(convertMessage);
      setMessages(convertedMessages);
      
      // 맨 아래로 스크롤 (여러 번 시도하여 확실히 스크롤)
      const scrollToBottom = () => {
        if (flatRef.current) {
          flatRef.current.scrollToEnd({ animated: false });
        }
      };
      
      // 즉시 스크롤 시도
      setTimeout(scrollToBottom, 50);
      // 렌더링 완료 후 다시 스크롤
      setTimeout(scrollToBottom, 200);
      // 추가 안전장치
      setTimeout(scrollToBottom, 500);
      
      // 초기 렌더 후 맨 아래에 있으면 read-sync 호출
      if (convertedMessages.length > 0) {
        const lastMsgId = convertedMessages[convertedMessages.length - 1].msgId;
        setTimeout(() => performReadSync(lastMsgId), 300);
      }
      
      // 초기 로드 완료 표시
      initialLoadCompleteRef.current = true;
    } catch (error: any) {
      console.error('메시지 로드 실패:', error);
      console.error('에러 상세:', error.response?.data || error.message);
      Alert.alert('오류', '메시지를 불러오는데 실패했습니다.');
      initialLoadCompleteRef.current = true;
    } finally {
      setLoading(false);
    }
  };

  // 스크롤 위치 감지 및 읽음 상태 동기화
  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    setIsNearBottom(isBottom);
    
    // 맨 밑으로 스크롤하면 새 메시지 배지 숨김 및 read-sync
    if (isBottom) {
      setNewMessageCount(0);
      
      // 맨 아래에 있고 메시지가 있으면 read-sync
      if (messages.length > 0) {
        const lastMsgId = messages[messages.length - 1].msgId;
        performReadSync(lastMsgId);
      }
    }
  }, [messages, performReadSync]);

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
          // 변화가 있을 때만 호출 (이미 동기화된 메시지면 스킵)
          if (lastSyncedMsgIdRef.current === null || lastMsgId > lastSyncedMsgIdRef.current) {
            performReadSync(lastMsgId);
          }
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [roomId, messages, performReadSync]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (readSyncTimeoutRef.current) {
        clearTimeout(readSyncTimeoutRef.current);
      }
    };
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

    // WebSocket을 통해 메시지 전송
    if (isConnected && currentUserId !== null) {
      console.log('onPressSend: 메시지 전송 시작:', {
        content: text.substring(0, 20),
        currentUserId,
        isConnected
      });
      
      // Optimistic update: 메시지를 즉시 로컬 상태에 추가
      const tempMsgId = Date.now(); // 임시 ID (서버에서 받은 메시지로 교체됨)
      const optimisticMessage: ChatMsg = {
        id: `temp-${tempMsgId}`,
        msgId: tempMsgId,
        type: 'TEXT',
        content: text,
        createdAt: new Date().toISOString(),
        mine: true, // 내가 보낸 메시지이므로 항상 true
        senderId: currentUserId,
        isRead: false,
        isOptimistic: true, // 임시 메시지 표시
        optimisticContent: text, // 매칭용 원본 내용
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setInput('');
      
      // WebSocket으로 메시지 전송
      sendMessage(text, 'TEXT');
      
      console.log('onPressSend: 메시지 WebSocket 전송 완료');
      
      // 맨 아래로 스크롤
      setTimeout(() => {
        flatRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } else {
      Alert.alert('오류', '채팅 서버와 연결되지 않았습니다.');
    }
  };

  const onPressPlus = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as const,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorMessage) {
        console.error('이미지 선택 오류:', response.errorMessage);
        Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          sendImageMessage(asset.uri);
        }
      }
    });
  };

  const sendImageMessage = async (imageUri: string) => {
    try {
      // 1. 이미지를 서버에 업로드
      const uploadedImageUrl = await uploadChatImage(imageUri);
      
      // 2. HTTP API를 사용하여 메시지 전송 (WebSocket 대신)
      const messageData = {
        content: uploadedImageUrl,
        contentType: 'IMAGE',
      };

      const response = await apiClient.post(`/api/chat/rooms/${roomId}/send`, messageData);

      if (response.status === 200) {
        // 전송된 메시지를 로컬 상태에 즉시 추가
        const responseData = response.data;
        
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
          
          // 맨 아래로 스크롤
          setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
        }
        
        // 입력창 초기화
        setInput('');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('이미지 전송 실패:', error);
      
      // 더 자세한 오류 정보 로깅
      if (error.response) {
        console.error('서버 응답 오류:', {
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
            console.error('파싱된 오류 데이터:', parsedData);
          } catch (e) {
            console.error('원본 오류 데이터 (JSON 파싱 실패):', error.response.data);
          }
        }
      } else if (error.request) {
        console.error('요청 오류 (서버 응답 없음):', error.request);
      } else {
        console.error('기타 오류:', error.message);
      }
      
      const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류';
      Alert.alert('오류', '이미지 전송에 실패했습니다: ' + errorMessage);
    }
  };

  const renderRow = ({ item }: { item: any }) => {
    // 날짜 라벨
    if (item.__date) {
      return <ChatDateLabel date={item.__date} />;
    }

    // 메시지 버블
    // 디버깅: 메시지 표시 정보 로그
    if (__DEV__) {
      console.log('renderRow:', {
        msgId: item.msgId,
        senderId: item.senderId,
        currentUserId: currentUserId,
        mine: item.mine,
        content: item.content?.substring(0, 20)
      });
    }

    // 내 메시지인 경우 말풍선과 "1" 표시를 함께 배치
    if (item.mine) {
      const contentWidth = bubbleContentWidths.get(item.msgId);
      
      return (
        <View style={{ 
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          marginVertical: 6,
          alignSelf: 'flex-end',
          position: 'relative',
        }}>
          {/* 말풍선이 콘텐츠에 맞는 너비만 차지하되, 최소 너비 보장 */}
          <View style={{ minWidth: 180, flexShrink: 0 }}>
            <ChatMessageBubble
              content={item.content || ''}
              type={item.type}
              mine={true}
              onContentLayout={(width) => {
                setBubbleContentWidths(prev => {
                  const newMap = new Map(prev);
                  newMap.set(item.msgId, width);
                  return newMap;
                });
              }}
            />
          </View>
          {/* 내 메시지이고 읽지 않은 경우 "1" 표시 - 실제 콘텐츠 너비에 맞춰 배치 */}
          {item.isRead === false && contentWidth && (
            <Text style={{ 
              position: 'absolute',
              right: contentWidth - 1, // 실제 콘텐츠 너비 기준으로 배치
              bottom: 2,
              color: '#E78182',
              fontSize: 14,
              fontWeight: 'bold',
            }}>1</Text>
          )}
        </View>
      );
    }

    // 상대방 메시지는 기존처럼
    return (
      <ChatMessageBubble
        content={item.content || ''}
        type={item.type}
        mine={false}
      />
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
            onContentSizeChange={() => {
              // 초기 로드 시에는 항상 스크롤, 이후에는 하단에 있을 때만 스크롤
              if (initialLoadCompleteRef.current) {
                // 초기 로드 완료 후에는 하단에 있을 때만 스크롤
                if (isNearBottom && !loading) {
                  setTimeout(() => {
                    flatRef.current?.scrollToEnd({ animated: false });
                  }, 50);
                }
              } else {
                // 초기 로드 중에는 항상 스크롤
                setTimeout(() => {
                  flatRef.current?.scrollToEnd({ animated: false });
                }, 50);
              }
            }}
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
