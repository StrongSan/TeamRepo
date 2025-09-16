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

type Props = {
  userId: string;
};

const CustomerBottomBar: React.FC<Props> = ({ userId }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.navContainer}>
      {/* 검색 */}
      <View style={styles.navIcon}>
        <SearchIcon width={24} height={24} />
      </View>

      <TouchableOpacity
        style={styles.navIcon}
        onPress={() => navigation.navigate("ChatList", { userId, userType: "customer" })}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MailIcon width={30} height={30} />
      </TouchableOpacity>

      {/* 홈 */}
      <TouchableOpacity
        style={[styles.navIcon, styles.homeIconContainer]}
        onPress={() => {
          navigation.navigate("MainScreen", { userId, userType: "customer" });
        }}
      >
        <HomeIcon width={33} height={33} />
      </TouchableOpacity>

      {/* 찜(하트) → WishListScreen 이동 */}
      <TouchableOpacity
        style={styles.navIcon}
        onPress={() => navigation.navigate("WishList", { userId, userType: "customer" })}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <HeartIcon width={30} height={30} />
      </TouchableOpacity>

      {/* 더보기 → 마이페이지 */}
      <TouchableOpacity
        style={styles.navIcon}
        onPress={() => navigation.navigate("MypageScreen", { userId, userType: "customer" })}
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
