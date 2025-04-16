import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import AllowLeftIcon from "../../assets/icons/allowLeft.svg";

interface TopBarProps {
  title: string;
  onBackPress?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, onBackPress }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.shadowContainer}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onBackPress}>
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
    marginBottom: 12, // 하단 공백
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
