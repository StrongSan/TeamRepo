import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import FilledHeart from "../../assets/icons/heart-filled.svg";
import OutlineHeart from "../../assets/icons/heart-outline.svg";
import apiClient from "../api/apiClient";
import { BASE_URL } from "../api/config";

const screenWidth = Dimensions.get("window").width;
const gap = 6;
const padding = 10;
const itemSize = (screenWidth - gap * 2 - padding * 2) / 3;

interface PhotoGridProps {
  userId?: string;
  userType?: "seller" | "customer";
}

type PhotoItem = {
  id: number;
  imageUrl: string;
  liked: boolean;
  postId?: number;
};

const PhotoGrid: React.FC<PhotoGridProps> = ({ userId, userType }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // TODO: 실제 API가 구현되면 교체 필요
        // seller의 경우: 자신이 작성한 게시글
        // customer의 경우: 찜한 게시글
        if (userType === "seller") {
          // 예: const response = await apiClient.get(`/api/cake-posts/seller/${userId}`);
          // setPhotos(response.data.map((post: any) => ({ id: post.postId, imageUrl: post.imageUrl, liked: false, postId: post.postId })));
        } else {
          // 예: const response = await apiClient.get(`/api/favorites/user/${userId}`);
          // setPhotos(response.data.map((fav: any) => ({ id: fav.postId, imageUrl: fav.imageUrl, liked: true, postId: fav.postId })));
        }
        
        // API가 구현될 때까지 빈 배열 유지
        setPhotos([]);
      } catch (error) {
        console.error("사진 로드 실패:", error);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [userId, userType]);

  const handleLikeToggle = (index: number) => {
    const updated = [...photos];
    updated[index].liked = !updated[index].liked;
    setPhotos(updated);
    
    // TODO: API 호출로 찜 상태 업데이트
    // if (updated[index].postId) {
    //   if (updated[index].liked) {
    //     await addFavorite(updated[index].postId);
    //   } else {
    //     await removeFavorite(updated[index].postId);
    //   }
    // }
  };

  const renderRows = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#E78182" />
        </View>
      );
    }

    if (photos.length === 0) {
      return null;
    }

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
              {item.imageUrl ? (
                <Image
                  source={{
                    uri: item.imageUrl.startsWith("http")
                      ? item.imageUrl
                      : `${BASE_URL}${item.imageUrl}`,
                  }}
                  style={[styles.photoImage, { width: itemSize, height: itemSize }]}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.photoPlaceholder, { width: itemSize, height: itemSize }]} />
              )}
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
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  photoImage: {
    borderRadius: 10,
  },
  photoPlaceholder: {
    backgroundColor: "#DBDBDB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});

export default PhotoGrid;
