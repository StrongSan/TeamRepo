// ✅ TopBar.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AllowLeftIcon from "../../assets/icons/allowLeft.svg";
import { useNavigation } from "@react-navigation/native";
import { StyleProp, ViewStyle } from "react-native";

interface TopBarProps {
  title: string;
  onBackPress?: () => void; // ✅ 여기를 handleBack ❌ → onBackPress ✅
  style?: StyleProp<ViewStyle>;
}

const TopBar: React.FC<TopBarProps> = ({ title, onBackPress, style }) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress(); // ✅ props로 받은 onBackPress 실행
    } else {
      navigation.goBack(); // ✅ 없으면 기본 goBack
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: "#fff" }}>
      <View style={[styles.container, style]}>
        <TouchableOpacity onPress={handleBack}>
          <AllowLeftIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.titleText}>{title}</Text>
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
