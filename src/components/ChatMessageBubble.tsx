import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import apiClient from '../api/apiClient';

const PINK = '#f1b6b6';

interface ChatMessageBubbleProps {
  content: string;
  type: 'TEXT' | 'IMAGE';
  mine: boolean;
  onContentLayout?: (width: number) => void; // 실제 콘텐츠 너비 측정 콜백
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  content,
  type,
  mine,
  onContentLayout,
}) => {
  const isImage = type === 'IMAGE';

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
              uri: content,
              cache: 'force-cache',
            }}
            style={styles.imageBubble}
            resizeMode="cover"
            onLoad={(e) => {
              if (onContentLayout && e.nativeEvent.source.width) {
                // 이미지의 실제 렌더링 너비 측정
                onContentLayout(e.nativeEvent.source.width);
              }
              console.log('이미지 로드 성공:', content);
              console.log('이미지 URL 형식 확인:', {
                url: content,
                isFilesPath: content.includes('/files/'),
                isApiPath: content.includes('/api/chat/images/'),
              });
            }}
            onError={(error) => {
              console.error('이미지 로드 실패:', content);
              console.error('오류 상세:', error.nativeEvent.error);
              console.error('오류 타입:', typeof error.nativeEvent.error);

              console.log('이미지 URL 분석:', {
                originalUrl: content,
                isFilesPath: content.includes('/files/'),
                isApiPath: content.includes('/api/chat/images/'),
                expectedFormat: `${apiClient.defaults.baseURL}/files/{filename}`,
                urlParts: content.split('/'),
                filename: content.split('/').pop(),
              });

              console.log('네트워크 상태 확인:', {
                isLocalhost: content.includes('10.0.2.2'),
                isHttp: content.startsWith('http://'),
                isHttps: content.startsWith('https://'),
              });

              console.log('이미지 로드 실패 - 백엔드 직접 파일 서빙 엔드포인트 확인 필요');
            }}
          />
        ) : (
          <Text 
            style={styles.msgText}
            onLayout={(e) => {
              // 텍스트의 실제 너비만 측정 (padding 제외)
              if (onContentLayout && mine && !isImage) {
                const { width } = e.nativeEvent.layout;
                // paddingHorizontal: 12 (좌우 각 12px)를 더해서 말풍선의 실제 너비 계산
                // 하지만 minWidth 때문에 실제로는 max(텍스트+padding, 180)가 됨
                // 실제 텍스트 길이에 맞춰 "1"을 배치하려면 텍스트 너비 + padding만 사용
                onContentLayout(width + 24); // paddingHorizontal 12 * 2 = 24
              }
            }}
          >
            {content}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  left: {
    justifyContent: 'flex-start',
  },
  right: {
    justifyContent: 'flex-end',
  },
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
  noPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  imageBubble: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  msgText: {
    fontSize: 14,
    color: '#222',
    lineHeight: 20,
  },
});

export default ChatMessageBubble;
