import React from "react";
<<<<<<< HEAD
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Platform,
  StatusBar,
} from "react-native";
=======
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
>>>>>>> origin/frontA
import AllowLeftIcon from "../../assets/icons/allowLeft.svg";
import { useNavigation } from "@react-navigation/native";

const TopBar: React.FC<{ title: string; onBackPress?: () => void }> = ({ title, onBackPress }) => {
  const navigation = useNavigation();

<<<<<<< HEAD
  // ✅ Android에서만 상태바 높이만큼 패딩 추가
  const topPadding = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View style={[styles.wrapper, { paddingTop: topPadding }, style]}>
      <View style={styles.shadowContainer}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onBackPress ?? (() => navigation.goBack())}>
            <AllowLeftIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.titleText}>{title}</Text>
        </View>
=======
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onBackPress ?? (() => navigation.goBack())}>
          <AllowLeftIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.titleText}>{title}</Text>
>>>>>>> origin/frontA
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 8,
    color: "#000",
    lineHeight: 24,
  },
});

export default TopBar;
