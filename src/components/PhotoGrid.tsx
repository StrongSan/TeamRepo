import React, { useState } from "react";
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";
import FilledHeart from "../../assets/icons/heart-filled.svg";
import OutlineHeart from "../../assets/icons/heart-outline.svg";

const screenWidth = Dimensions.get("window").width;
const gap = 6;
const padding = 10;
const itemSize = (screenWidth - gap * 2 - padding * 2) / 3;

const MAX_PHOTOS = 30; // 임시 제한값. 나중엔 이걸 서버에서 받은 값으로 대체할 것

const PhotoGrid = () => {
  const [photos, setPhotos] = useState(
    Array.from({ length: 12 }, (_, i) => ({ id: i, liked: false })));

  const handleLikeToggle = (index: number) => {
    const updated = [...photos];
    updated[index].liked = !updated[index].liked;
    setPhotos(updated);
  };

  const loadMorePhotos = () => {
    if(photos.length >= MAX_PHOTOS) return;

    const nextBatchSize = Math.min(12, MAX_PHOTOS - photos.length); //남은 수 만큼만 생성
    const next = Array.from({ length: 12 }, (_, i) => ({
      id: photos.length + i,
      liked: false,
    }));
    setPhotos([...photos, ...next]);
  };

  return (
    <FlatList
      data={photos}
      numColumns={3}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <View style={[styles.photoItem, { width: itemSize, height: itemSize }]}>
          <TouchableOpacity
            onPress={() => handleLikeToggle(index)}
            style={styles.heartButton}
          >
            {item.liked ? <FilledHeart width={20} height={20} /> : <OutlineHeart width={20} height={20} />}
          </TouchableOpacity>
        </View>
      )}
      
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      onEndReached={loadMorePhotos}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: padding,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: gap,
  },
  photoItem: {
    backgroundColor: "#DBDBDB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  
});

export default PhotoGrid;
