
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 768;

const Logo: React.FC = () => {
  const getImageSize = () => {
    if (isSmallScreen) return 200;
    if (isMediumScreen) return 240;
    return 271;
  };

  const imageSize = getImageSize();

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/102368c2327d087eac00cdfbb70e0f904352c0e9',
        }}
        style={[styles.image, { width: imageSize, height: imageSize }]}
        accessibilityLabel='Cake illustration'
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>CakedaY</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  image: {
    resizeMode: 'contain',
  },
  textContainer: {
    width: '100%',
    marginTop: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: '#000',
    lineHeight: 40,
  },
});

export default Logo;



