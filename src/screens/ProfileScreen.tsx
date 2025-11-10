import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
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
import { getMyProfile, type ProfileResponse } from "../api/userAPI";

type ProfileScreenRouteProp = RouteProp<RootStackParamList, "ProfileScreen">;

const MOCK_PROFILE = {
  username: "cakeee",
  bio: "청주 케이크 맛집입니다 ♥",
  rating: 3.0,
  isFollowing: false,
};

const ProfileScreen = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const { userType, userId } = route.params;

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getMyProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("프로필 정보 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const displayName = profile?.nickname || profile?.userName || MOCK_PROFILE.username;
  const displayBio = profile?.favoriteArea || MOCK_PROFILE.bio;
  const displayUserType = profile?.userType || userType;
  const displayRating =
    typeof (profile as any)?.rating === "number" ? (profile as any).rating : MOCK_PROFILE.rating;

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TopBar title=" " />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E78182" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        <TopBar title=" " />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ProfileAvatarBlock />
            <View style={styles.profileContent}>
              <ProfileInfo
                username={displayName}
                bio={displayBio}
                rating={displayRating}
                userType={displayUserType}
                isFollowing={MOCK_PROFILE.isFollowing}
              />
              <PhotoGrid userId={userId} userType={displayUserType} />
            </View>
          </ScrollView>
          {displayUserType === "seller" ? (
            <SellerBottomBar userId={userId} />
          ) : (
            <CustomerBottomBar userId={userId} />
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
