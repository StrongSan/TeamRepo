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

const PLACEHOLDER_ITEMS: PhotoItem[] = [
  { id: 1, imageUrl: "", liked: true },
  { id: 2, imageUrl: "", liked: false },
  { id: 3, imageUrl: "", liked: false },
  { id: 4, imageUrl: "", liked: true },
  { id: 5, imageUrl: "", liked: false },
  { id: 6, imageUrl: "", liked: false },
];

const PhotoGrid: React.FC<PhotoGridProps> = ({ userId, userType }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [placeholderPhotos, setPlaceholderPhotos] = useState<PhotoItem[]>(PLACEHOLDER_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      if (!userId) {
        setLoading(false);
        setPhotos([]);
        setPlaceholderPhotos(PLACEHOLDER_ITEMS);
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
        setPlaceholderPhotos(PLACEHOLDER_ITEMS);
      } catch (error) {
        console.error("사진 로드 실패:", error);
        setPhotos([]);
        setPlaceholderPhotos(PLACEHOLDER_ITEMS);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [userId, userType]);

  const handleLikeToggle = (index: number) => {
    if (photos.length > 0) {
      const updated = [...photos];
      updated[index].liked = !updated[index].liked;
      setPhotos(updated);
      return;
    }

    const updatedPlaceholder = [...placeholderPhotos];
    updatedPlaceholder[index].liked = !updatedPlaceholder[index].liked;
    setPlaceholderPhotos(updatedPlaceholder);
    
    // TODO: API 호출로 찜 상태 업데이트 (실제 데이터가 있을 때)
  };

  const renderRows = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#E78182" />
        </View>
      );
    }

    const data = photos.length > 0 ? photos : placeholderPhotos;
    if (data.length === 0) {
      return null;
    }

    const rows = [];
    for (let i = 0; i < data.length; i += 3) {
      const rowItems = data.slice(i, i + 3);
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
