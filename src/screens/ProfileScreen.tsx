import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";

import TopBar from "../components/TopBar";
import ProfileAvatarBlock from "../components/ProfileAvatarBlock";
import ProfileInfo from "../components/ProfileInfo";
import PhotoGrid from "../components/PhotoGrid";
import CustomerBottomBar from "../components/CustomerBottomBar";
import SellerBottomBar from "../components/SellerBottomBar";

import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";

type ProfileScreenRouteProp = RouteProp<RootStackParamList, "ProfileScreen">;

const ProfileScreen = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const { userType } = route.params;

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          {/* ✅ TopBar 외부 SafeAreaView로 감싸줌 */}
          <SafeAreaView style={styles.topBarArea}>
            <TopBar title="프로필" />
          </SafeAreaView>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ProfileAvatarBlock />
            <View style={styles.profileContent}>
              <ProfileInfo
                username="cakeee"
                bio="청주 케이크 맛집입니다 ♥"
                rating={3.0}
                userType={userType}
                isFollowing={false}
              />
              <PhotoGrid />
            </View>
          </ScrollView>

          {userType === "seller" ? <SellerBottomBar /> : <CustomerBottomBar />}
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
    backgroundColor: "#FFFFFF",
  },
  topBarArea: {
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
