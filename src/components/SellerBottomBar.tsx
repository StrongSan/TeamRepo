import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator"; 

import BottomMore from "../../assets/icons/bottom-more.svg";
import MailIcon from "../../assets/icons/mail-icon.svg";
import HomeIcon from "../../assets/icons/home-icon.svg";
import BottomPlus from "../../assets/icons/bottom-plus.svg";
import ProfileIcon from "../../assets/icons/bottom-profile-icon.svg";

const SellerBottomBar: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate("MainScreen")}>
        <HomeIcon width={33} height={33} fill="#E78182" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate("MailScreen")}>
        <MailIcon width={30} height={30} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navIcon, styles.homeIconContainer]} onPress={() => navigation.navigate("SellerWriting")}>
        <BottomPlus width={30} height={30} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate("ProfileScreen")}>
        <ProfileIcon width={30} height={30} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate("MoreScreen")}>
        <BottomMore width={30} height={30} />
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

export default SellerBottomBar;
