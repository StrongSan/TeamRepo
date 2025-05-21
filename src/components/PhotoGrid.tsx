import React, { useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import FilledHeart from "../../assets/icons/heart-filled.svg";
import OutlineHeart from "../../assets/icons/heart-outline.svg";

const screenWidth = Dimensions.get("window").width;
const gap = 6;
const padding = 10;
const itemSize = (screenWidth - gap * 2 - padding * 2) / 3;

const MAX_PHOTOS = 30;

const PhotoGrid = () => {
  const [photos, setPhotos] = useState(
    Array.from({ length: 12 }, (_, i) => ({ id: i, liked: false }))
  );

  const handleLikeToggle = (index: number) => {
    const updated = [...photos];
    updated[index].liked = !updated[index].liked;
    setPhotos(updated);
  };

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < photos.length; i += 3) {
      const rowItems = photos.slice(i, i + 3);
      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {rowItems.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.photoItem, { width: itemSize, height: itemSize }]}
            >
              <TouchableOpacity
                onPress={() => handleLikeToggle(i + idx)}
                style={styles.heartButton}
              >
                {item.liked ? (
                  <FilledHeart width={20} height={20} />
                ) : (
                  <OutlineHeart width={20} height={20} />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      );
    }
    return rows;
  };

  return <View style={styles.container}>{renderRows()}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: padding,
  },
  row: {
    flexDirection: "row",
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
