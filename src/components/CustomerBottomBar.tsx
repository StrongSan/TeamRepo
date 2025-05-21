import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

import SearchIcon from "../../assets/icons/bottom-search.svg";
import MailIcon from "../../assets/icons/mail-icon.svg";
import HomeIcon from "../../assets/icons/home-icon.svg";
import HeartIcon from "../../assets/icons/heart-icon.svg";
import ProfileIcon from "../../assets/icons/bottom-profile-icon.svg";
import MoreIcon from "../../assets/icons/bottom-more.svg";

const CustomerBottomBar: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.navContainer}>

      {/* ✅ 검색 버튼 - 프로필 화면 이동 */}
      <View style={styles.navIcon}>
        <SearchIcon width={24} height={24} />
      </View>

      <View style={styles.navIcon}>
        <MailIcon width={30} height={30} />
      </View>

      {/* ✅ 홈 버튼 - 메인 화면 이동 */}
      <TouchableOpacity
        style={[styles.navIcon, styles.homeIconContainer]}
        onPress={() => navigation.navigate("MainScreen", { userType: "customer" })}
      >
        <HomeIcon width={33} height={33} />
      </TouchableOpacity>



      <View style={styles.navIcon}>
        <HeartIcon width={30} height={30} />
      </View>

      {/* ✅ 더보기 버튼 - 마이페이지로 이동 */}
      <TouchableOpacity
        style={styles.navIcon}
        onPress={() => navigation.navigate("MypageScreen", { userType: "customer" })}
      >
        <MoreIcon width={30} height={30} />
      </TouchableOpacity>
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
