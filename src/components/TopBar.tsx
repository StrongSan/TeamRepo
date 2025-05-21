import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Platform,
  StatusBar,
} from "react-native";
import AllowLeftIcon from "../../assets/icons/allowLeft.svg";
import { useNavigation } from "@react-navigation/native";

interface TopBarProps {
  title: string;
  onBackPress?: () => void;
  style?: ViewStyle;
}

const TopBar: React.FC<TopBarProps> = ({ title, onBackPress, style }) => {
  const navigation = useNavigation();

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
  },
  shadowContainer: {
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    backgroundColor: "#fff",
  },
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
