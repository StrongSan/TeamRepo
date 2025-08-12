import React, { useEffect } from 'react';
import {
  StyleSheet,
  Linking, // 여기
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      console.log('📥 딥링크 수신:', event.url);
      // 카카오 리디렉션 URL 처리 로직
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('🚀 앱이 딥링크로 시작됨:', url);
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
