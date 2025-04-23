import React from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar } from "react-native";
import TitleSection from "../components/TitleSection";
import SearchBar from "../components/SearchBar";
import GridLayout from "../components/GridLayout";
import CustomerBottomBar from "../components/CustomerBottomBar";
import SellerBottomBar from "../components/SellerBottomBar";

const MainScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TitleSection />
        <SearchBar />
        <GridLayout />
      </ScrollView>
      <SellerBottomBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  mainContainer: {
    width: "100%",
    maxWidth: 390,
    position: "relative",
    flex: 1,
  },
});

export default MainScreen;
