import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import ProfileAvatar from "../../assets/icons/profileAvatar.svg";
import AllowLeft from "../../assets/icons/allowLeft.svg";

const ProfileHeader = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? "#fff" : undefined}
      />

      {/* ✅ 상단 헤더 흰 배경 */}
      <View style={styles.topWhiteHeader}>
        <TouchableOpacity style={styles.backButtonContainer}>
          <AllowLeft width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* ✅ 회색 배경 */}
      <View style={styles.container}>
        {/* ✅ 아바타 */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarBackground}>
            <ProfileAvatar width={100} height={100} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topWhiteHeader: {
    backgroundColor: "white",
    height: 60, // 아이콘 감싸는 흰 배경 높이
    justifyContent: "center",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  container: {
    position: "relative",
    backgroundColor: "#EAEAEA",
    height: 240,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backButtonContainer: {
    zIndex: 10,
  },
  avatarWrapper: {
    position: "absolute",
    top: 200,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  avatarBackground: {
    backgroundColor: "#FFF",
    borderRadius: 100,
    padding: 8,
  },
});

export default ProfileHeader;
