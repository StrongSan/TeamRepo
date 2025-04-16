import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RatingDisplay from "./RatingDisplay";
import ProfileActionButtons from "./ProfileActionButtons";

interface ProfileInfoProps {
  username: string;
  bio: string;
  rating: number;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ username, bio, rating }) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.bio}>{bio}</Text>
      </View>
      <RatingDisplay rating={rating} />
      <ProfileActionButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 22,
    paddingTop: 90,
  },
  userInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  username: {
    fontSize: 24,
    color: "#000",
    fontFamily: "Inter",
  },
  bio: {
    fontSize: 16,
    color: "#616161",
    fontFamily: "Inter",
  },
});

export default ProfileInfo;
