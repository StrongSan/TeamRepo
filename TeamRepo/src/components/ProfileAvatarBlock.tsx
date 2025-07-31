import React from "react";
import { View, StyleSheet } from "react-native";
import ProfileAvatar from "../../assets/icons/profileAvatar.svg";

const ProfileAvatarBlock = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarBackground}>
          <ProfileAvatar width={100} height={100} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#EAEAEA",
    height: 240,
    justifyContent: "flex-end",
    alignItems: "center",
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

export default ProfileAvatarBlock;
