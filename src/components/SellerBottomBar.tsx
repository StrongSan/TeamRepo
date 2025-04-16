import React from "react";
import { View, StyleSheet } from "react-native";
import BottomMore from "../../assets/icons/bottom-more.svg";
import MailIcon from "../../assets/icons/mail-icon.svg";
import HomeIcon from "../../assets/icons/home-icon.svg";
import BottomPlus from "../../assets/icons/bottom-plus.svg";
import ProfileIcon from "../../assets/icons/bottom-profile-icon.svg";

const SellerBottomBar: React.FC = () => {
  return (
    <View style={styles.navContainer}>
      <View style={styles.navIcon}>
        <HomeIcon width={33} height={33} style={{ color: "#E78182" }} /> {/* 빨간줄 무시 가능 */}
      </View>
      <View style={styles.navIcon}>
        <MailIcon width={30} height={30} />
      </View>
      <View style={[styles.navIcon, styles.homeIconContainer]}>
        <BottomPlus width={30} height={30} />
      </View>
      <View style={styles.navIcon}>
        <ProfileIcon width={30} height={30} />
      </View>
      <View style={styles.navIcon}>
        <BottomMore width={30} height={30} />
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

export default SellerBottomBar;
