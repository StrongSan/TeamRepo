import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfo from "../components/ProfileInfo";
import PhotoGrid from "../components/PhotoGrid";
import CustomerBottomBar from "../components/CustomerBottomBar";

const ProfileScreen = () => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF" // iOS는 무시될 수 있음
        translucent={false}       // Android에서 덮어씌우지 않게
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ProfileHeader />
            <View style={styles.profileContent}>
              <ProfileInfo
                username="cakeee"
                bio="청주 케이크 맛집입니다 ♥"
                rating={3.0}
              />
              <PhotoGrid />
            </View>
          </ScrollView>
          <CustomerBottomBar />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileContent: {
    width: "100%",
    minHeight: 700,
    position: "relative",
    backgroundColor: "#FFFFFF",
    paddingBottom: 80,
  },
});

export default ProfileScreen;
