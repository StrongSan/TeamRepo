import React, { useState } from "react";
import { Image, StyleSheet, View, Dimensions, Text } from "react-native";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth * 0.8; // 80%로 계산

const ProductImage: React.FC<{ uri: string }> = ({ uri }) => {
  const [imageError, setImageError] = useState(false);
  
  // 디버깅: 이미지 URL 확인
  console.log('🖼️ ProductImage 디버깅:', {
    uri,
    uriType: typeof uri,
    uriLength: uri?.length,
    isValid: uri && uri.length > 0
  });
  
  if (imageError || !uri) {
    return (
      <View style={[styles.wrapper, { width: imageSize, height: imageSize }]}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>이미지 없음</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.wrapper, { width: imageSize, height: imageSize }]}>
      <Image 
        source={{ uri }} 
        style={styles.image}
        onError={(error) => {
          console.log('❌ 이미지 로드 실패:', error.nativeEvent);
          setImageError(true);
        }}
        onLoad={() => {
          console.log('✅ 이미지 로드 성공:', uri);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 16,
    alignSelf: "center", // 가운데 정렬
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
});

export default ProductImage;
