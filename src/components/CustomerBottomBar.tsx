import React from "react";
import { View, StyleSheet } from "react-native";
import SearchIcon from "../../assets/icons/bottom-search.svg";
import MailIcon from "../../assets/icons/mail-icon.svg";
import HomeIcon from "../../assets/icons/home-icon.svg";
import HeartIcon from "../../assets/icons/heart-icon.svg";
import ProfileIcon from "../../assets/icons/bottom-profile-icon.svg";

const CustomerBottomBar: React.FC = () => {
  return (
    <View style={styles.navContainer}>
      <View style={styles.navIcon}>
        <SearchIcon width={25} height={25} />
      </View>
      <View style={styles.navIcon}>
        <MailIcon width={30} height={30} />
      </View>
      <View style={[styles.navIcon, styles.homeIconContainer]}>
        <HomeIcon width={30} height={30} style={{ color: "white"}} /> {/* 빨간줄 무시 가능 */}
      </View>
      <View style={styles.navIcon}>
        <HeartIcon width={30} height={30} />
      </View>
      <View style={styles.navIcon}>
        <ProfileIcon width={30} height={30} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingTop: 15,
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "white",
  },
  navIcon: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  homeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E78182",
  },
});

export default CustomerBottomBar;
