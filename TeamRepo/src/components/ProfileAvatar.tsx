import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SvgXml } from "react-native-svg";
import CameraIcon from "../../assets/icons/camera-icon.svg";
import { launchImageLibrary } from "react-native-image-picker";

const avatarCircleSvg = `
  <svg width="121" height="120" viewBox="0 0 121 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.5 60C0.5 26.8629 27.3629 0 60.5 0C93.6371 0 120.5 26.8629 120.5 60C120.5 93.1371 93.6371 120 60.5 120C27.3629 120 0.5 93.1371 0.5 60Z" fill="#C8BBBB"/>
  </svg>
`;

const profileIconSvg = `
  <svg width="73" height="72" viewBox="0 0 73 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M44.8097 29.52C44.8097 34.4075 44.0591 36.0279 43.5079 36.6523C43.0592 37.1634 41.6271 38.2321 36.5 38.2321C31.373 38.2321 29.9409 37.1634 29.4922 36.6523C28.941 36.0279 28.1904 34.4075 28.1904 29.52C28.1904 24.7081 31.9103 20.808 36.5 20.808C41.0898 20.808 44.8097 24.7081 44.8097 29.52ZM47.1226 41.0693C49.5573 38.7345 50.3495 34.9593 50.3495 29.52C50.3495 21.5021 44.1477 15 36.5 15C28.8524 15 22.6506 21.5021 22.6506 29.52C22.6506 34.9593 23.4428 38.7345 25.8775 41.0693C21.2684 43.7148 17.6537 48.0273 15.7702 53.2342C15.4267 54.1867 15.3464 55.2902 15.9142 56.1179C17.4875 58.4091 20.551 55.7955 21.8141 53.301C24.6034 47.7921 30.1348 44.0401 36.5 44.0401C42.8653 44.0401 48.3967 47.7921 51.186 53.301C52.4491 55.7955 55.5126 58.4091 57.0859 56.1179C57.6537 55.2902 57.5734 54.1867 57.2299 53.2342C55.3464 48.0273 51.7317 43.7148 47.1226 41.0693Z" fill="white" stroke="#C8BBBB"/>
  </svg>
`;

const ProfileAvatar = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 1,
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri || null);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
<View style={styles.avatarContainer}>
  {imageUri ? (
    <View style={styles.profileIconContainer}>
      <Image source={{ uri: imageUri }} style={styles.profileImage} />
    </View>
  ) : (
    <View style={styles.profileIconContainer}>
      {/* 배경 원 */}
      <SvgXml xml={avatarCircleSvg} width={120} height={120} />
      {/* 프로필 기본 아이콘 */}
      <View style={styles.iconOverlay}>
        <SvgXml xml={profileIconSvg} width={72} height={72} />
      </View>
    </View>
  )}

  {/* 카메라 버튼은 항상 표시 */}
  <TouchableOpacity style={styles.cameraButton} onPress={handleSelectImage}>
    <CameraIcon width={24} height={24} />
  </TouchableOpacity>
</View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    width: 120,
    height: 120,
  },
  cameraButton: {
    position: "absolute",
    right: -12,
    bottom: -8,
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
    borderWidth: 8,
    borderColor: "#FFF",
    backgroundColor: "#F4F7F2",
  },
  profileIconContainer: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  iconOverlay: {
    position: "absolute",
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  
});

export default ProfileAvatar;
