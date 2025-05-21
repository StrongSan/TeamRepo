import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AllowLeftIcon from "../../assets/icons/allowLeft.svg";
import { useNavigation } from "@react-navigation/native";

const TopBar: React.FC<{ title: string; onBackPress?: () => void }> = ({ title, onBackPress }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onBackPress ?? (() => navigation.goBack())}>
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
