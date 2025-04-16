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

const Header = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? "#fff" : undefined}
      />
      <View style={styles.headerContainer}>
        <TouchableOpacity>
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
    flexDirection: "row",       // 가로 정렬
    alignItems: "center",       // 세로 중앙 정렬
    justifyContent: "flex-start", // 왼쪽 정렬
    height: 60,
    paddingHorizontal: 16,
    paddingBottom: 0,
    marginBottom: 0
  },
});

export default Header;
