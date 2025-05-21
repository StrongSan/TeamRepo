import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AllowLeft from "../../assets/icons/allowLeft.svg";

const Header = () => {
  const navigation = useNavigation(); // ✅ 뒤로가기 기능

  const topPadding = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View style={[styles.safeArea, { paddingTop: topPadding }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AllowLeft width={24} height={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 60,
    paddingHorizontal: 16,
  },
});

export default Header;
