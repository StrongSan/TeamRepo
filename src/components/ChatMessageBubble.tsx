import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import apiClient from '../api/apiClient';

const PINK = '#f1b6b6';

interface ChatMessageBubbleProps {
  content: string;
  type: 'TEXT' | 'IMAGE';
  mine: boolean;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  content,
  type,
  mine,
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
            onLoad={() => {
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
          <Text style={styles.msgText}>{content}</Text>
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
