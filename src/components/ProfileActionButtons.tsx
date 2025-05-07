import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  isFollowing: boolean;
  userType: "customer" | "seller";
}

const ProfileActionButtons: React.FC<Props> = ({ isFollowing, userType }) => {
  const renderCustomerButtons = () => (
    <>
      <TouchableOpacity style={styles.buttonWrapper}>
        <View
          style={[
            styles.baseButton,
            isFollowing ? styles.followingOutlined : styles.followingFilled
          ]}
        >
          <Text style={isFollowing ? styles.outlinedText : styles.filledText}>
            {isFollowing ? "팔로잉" : "팔로우"}
          </Text>

        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonWrapper}>
        <View style={[styles.baseButton, styles.outlinedButton]}>
          <Text style={styles.outlinedText}>메세지</Text>
        </View>
      </TouchableOpacity>
    </>
  );

  const renderSellerButtons = () => (
    <>
      <TouchableOpacity style={styles.buttonWrapper}>
        <View style={[styles.baseButton, styles.outlinedButton]}>
          <Text style={styles.outlinedText}>내 팔로워</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonWrapper}>
        <View style={[styles.baseButton, styles.outlinedButton]}>
          <Text style={styles.outlinedText}>프로필 편집</Text>
        </View>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      {userType === "customer" ? renderCustomerButtons() : renderSellerButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    marginTop: 2,
    marginBottom: 10,
  },
  buttonWrapper: {
    width: 150,
  },
  baseButton: {
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  followingFilled: {
    backgroundColor: "#E78182",
    borderColor: "#E78182",
  },
  followingOutlined: {
    borderColor: "#E78182",
  },
  outlinedButton: {
    borderColor: "#E78182",
  },
  filledText: {
    color: "white",
    fontSize: 16,
  },
  outlinedText: {
    color: "#E78182",
    fontSize: 16,
  },
});

export default ProfileActionButtons;
