import React from 'react';
import { View, StyleSheet, Dimensions, } from 'react-native';
import Logo from '../components/Logo';
import KakaoButton from '../components/KakaoButton';
import { useKakaoLogin } from '../hooks/useKakaoLogin';
import NaverButton from '../components/NaverButton';

const { width } = Dimensions.get("window");
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 768;

const LoginScreen: React.FC = () => {
  const { handleKakaoLogin } = useKakaoLogin();
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Logo />
        <View style={styles.buttonContainer}>
          <KakaoButton onPress={handleKakaoLogin} />
          <NaverButton />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingRight: 49,
    paddingBottom: 67,
    paddingLeft: 49,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 100,
    width: "100%",
    maxWidth: 292,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 30,
    width: "100%",
  },
});

export default LoginScreen;