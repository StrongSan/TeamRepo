import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import AllowLeft from "../../assets/icons/allowLeft.svg";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? "#fff" : undefined}
      />
      <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <AllowLeft width={24} height={24} />
    </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,

    // ✅ Android는 상태바 높이만큼 위쪽 여백 확보
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,

    // ✅ 높이는 고정하지 않고, 내부 padding 기준으로 구성
    paddingBottom: 12,
  },
});

export default Header;
