import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const ProfileActionButtons = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonWrapper}>
        <View style={styles.followingButton}>
          <Text style={styles.buttonText}>팔로잉</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonWrapper}>
        <View style={styles.messageButton}>
          <Text style={styles.buttonText}>메세지</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    marginTop: 2,
    marginBottom: 10,
    width: 306,
    maxWidth: "100%",
    alignItems: "center",
    gap: 30,
    fontSize: 16,
    color: "rgba(231, 129, 130, 1)",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonWrapper: {
    borderRadius: 16,
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
    width: 130,
  },
  followingButton: {
    alignSelf: "stretch",
    borderRadius: 16,
    borderColor: "rgba(231, 129, 130, 1)",
    borderStyle: "solid",
    borderWidth: 2,
    minHeight: 43,
    paddingLeft: 37,
    paddingRight: 37,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  messageButton: {
    alignSelf: "stretch",
    borderRadius: 16,
    borderColor: "rgba(231, 129, 130, 1)",
    borderStyle: "solid",
    borderWidth: 2,
    minHeight: 43,
    paddingLeft: 37,
    paddingRight: 37,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "rgba(231, 129, 130, 1)",
    fontSize: 16,
  },
});

export default ProfileActionButtons;
