import { useEffect, useRef, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenManager } from '../utils/tokenManager';
import { StompMessage, ChatMessage } from '../api/chatAPI';

interface UseChatWebSocketProps {
  roomId: number;
  onMessageReceived: (message: ChatMessage) => void;
  onReadReceipt?: (readerId: number, lastReadMsgId: number) => void;
}

// STOMP Frame 빌더
export const buildStompFrame = (command: string, headers: Record<string, string>, body = ''): string => {
  let frame = command + '\n';
  
  // 헤더 추가
  for (const [key, value] of Object.entries(headers)) {
    frame += key + ':' + value + '\n';
  }
  
  // 빈 줄 추가 (헤더와 바디 구분)
  frame += '\n';
  
  // 바디 추가
  if (body) {
    frame += body;
  }
  
  // NULL 문자로 프레임 종료
  frame += '\x00';
  
  return frame;
};

// STOMP Frame 파서
const parseStompFrame = (data: string) => {
  try {
    // CRLF → LF 통일 & 하트비트(단일 '\n') 무시
    if (data === '\n' || data === '\r\n') return null;
    const normalized = data.replace(/\r\n/g, '\n');

    const lines = normalized.split('\n');
    if (lines.length < 2) return null;

    const command = lines[0].trim();
    const headers: Record<string, string> = {};
    let bodyStartIndex = 1;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line === '') { bodyStartIndex = i + 1; break; }
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        headers[key] = value;
      }
    }
    const body = lines.slice(bodyStartIndex).join('\n').replace(/\0/g, '').trim();
    return { command, headers, body };
  } catch (e) {
    console.error('STOMP Frame 파싱 실패:', e);
    return null;
  }
};

export const useChatWebSocket = ({
  roomId,
  onMessageReceived,
  onReadReceipt,
}: UseChatWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const subscriptionIdRef = useRef<number>(1);

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;

    try {
      setIsConnecting(true);

      // 토큰
      const token = await TokenManager.getAccessToken();
      if (!token) {
        console.error('Access token not found');
        setIsConnecting(false);
        return;
      }

      // Android 에뮬레이터에서는 10.0.2.2가 PC의 localhost
      const HOST = Platform.OS === 'android' ? '10.0.2.2' : '172.30.176.1';
      const wsUrl = `ws://${HOST}:8080/ws-direct`;

      // React Native WebSocket은 서브프로토콜을 두 번째 인자로 전달
      const ws = new WebSocket(wsUrl, ['v12.stomp']);

      ws.onopen = () => {
        // STOMP CONNECT 프레임 구성
        const connectFrame = `CONNECT
accept-version:1.2
heart-beat:10000,10000
host:${HOST}:8080
Authorization:Bearer ${token}

\x00`;
        
        // 즉시 전송
        try {
          ws.send(connectFrame);
        } catch (error) {
          console.error('Failed to send CONNECT frame:', error);
        }
      };

      ws.onmessage = (event) => {
        const frame = parseStompFrame(event.data);
        if (!frame) {
          return;
        }

        if (frame.command === 'CONNECTED') {
          setIsConnected(true);
          setIsConnecting(false);

          const subscribeFrame = buildStompFrame('SUBSCRIBE', {
            'id': `sub-${subscriptionIdRef.current++}`,
            'destination': `/topic/rooms/${roomId}`,
          });
          ws.send(subscribeFrame);
          return;
        }

        if (frame.command === 'MESSAGE') {
          try {
            console.log('📬 STOMP MESSAGE 프레임 수신:', frame.body);
            const data: StompMessage = JSON.parse(frame.body);
            console.log('📦 파싱된 메시지 데이터:', data);
            
            if (data.type === 'READ_RECEIPT') {
              console.log('👁️ 읽음 확인 메시지:', data);
              onReadReceipt?.(data.readerId!, data.lastReadMsgId!);
            } else if (data.msgId && data.content && data.contentType && data.createdAt && data.senderId) {
              const chatMessage: ChatMessage = {
                msgId: data.msgId,
                roomId: data.roomId || roomId,
                senderId: data.senderId,
                content: data.content,
                contentType: data.contentType,
                createdAt: data.createdAt,
              };
              console.log('💬 채팅 메시지 전달:', chatMessage);
              onMessageReceived(chatMessage);
            } else {
              console.warn('⚠️ 메시지 형식이 올바르지 않음:', data);
            }
          } catch (e) {
            console.error('❌ 메시지 파싱 실패:', e);
            console.error('원본 데이터:', frame.body);
          }
          return;
        }

        if (frame.command === 'ERROR') {
          console.error('STOMP ERROR:', frame.headers, frame.body);
          setIsConnected(false);
          setIsConnecting(false);
        }
      };

      ws.onerror = (e: any) => {
        console.error('❌ WebSocket error:', e?.message ?? e);
        setIsConnected(false);
        setIsConnecting(false);
        // 에러 발생 시 자동 재연결 시도하지 않음 (무한 루프 방지)
      };

      ws.onclose = (e) => {
        setIsConnected(false);
        setIsConnecting(false);
        // 정상 종료가 아닌 경우에만 재연결 시도
        if (e.code !== 1000 && e.code !== 1001) {
          setTimeout(() => {
            if (!isConnecting && !isConnected) {
              connect();
            }
          }, 3000);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('connect() exception', error);
      setIsConnecting(false);
    }
  }, [roomId, onMessageReceived, onReadReceipt, isConnecting, isConnected]);

  // WebSocket 연결 해제
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      try {
        // STOMP DISCONNECT 프레임 전송
        const disconnectFrame = buildStompFrame('DISCONNECT', {});
        wsRef.current.send(disconnectFrame);
        
        // WebSocket 닫기
        wsRef.current.close();
      } catch (error) {
        // Silent fail
      }
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback(
    async (content: string, contentType: 'TEXT' | 'IMAGE' = 'TEXT') => {
      if (!wsRef.current || !isConnected || wsRef.current.readyState !== WebSocket.OPEN) {
        return;
      }
      
      try {
        const token = await TokenManager.getAccessToken();
        if (!token) {
          return;
        }

        const body = JSON.stringify({ content, contentType });
        const byteLen = body.length;
        const sendFrame = buildStompFrame('SEND', {
          'destination': `/app/rooms/${roomId}/send`,
          'content-type': 'application/json;charset=utf-8',
          'content-length': String(byteLen),
          'Authorization': `Bearer ${token}`,
        }, body);
        
        wsRef.current.send(sendFrame);
      } catch (error) {
        console.error('sendMessage error', error);
      }
    },
    [roomId, isConnected]
  );

  // 컴포넌트 마운트 시 연결
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    sendMessage,
    reconnect: connect,
    disconnect,
    wsRef,
  };
};