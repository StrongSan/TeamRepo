import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";

import BackHeader from "../components/BackHeader";
import ProfileAvatar from "../components/ProfileAvatar";
import InputField from "../components/InputField";
import UserTypeSection from "../components/UserTypeSection";
import CakePreferencesSection from "../components/CakePreferencesSection";
import PrimaryButton from "../components/PrimaryButton";

import { registerKakaoUser } from "../api/authAPI"; // ✅ 카카오 회원가입 API
import apiClient from "../api/apiClient"; // ✅ axios 인스턴스

type ProfileSetupRouteProp = RouteProp<RootStackParamList, "ProfileSetup">;

const ProfileSetupScreen: React.FC = () => {
  const route = useRoute<ProfileSetupRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState("");
  const [userType, setUserType] = useState<"seller" | "customer" | null>(null);
  const [selectedCakes, setSelectedCakes] = useState<number[]>([]);
  const [randomCakes, setRandomCakes] = useState<{ variantId: number; imageUrl: string }[]>([]);
  const [kakaoId, setKakaoId] = useState<string>(""); // ✅ kakaoId 상태 추가

  // ✅ 케이크 랜덤 추천 API 호출
  useEffect(() => {
    const fetchRandomCakes = async () => {
      try {
        const response = await apiClient.get("/api/cake-posts/random");
        setRandomCakes(response.data);
      } catch (error) {
        console.error("랜덤 케이크 불러오기 실패", error);
      }
    };

    fetchRandomCakes();
  }, []);

  useEffect(() => {
    const { location, nickname, userType, selectedCakes, kakaoId: routeKakaoId, profileImg } = route.params || {};
    console.log('🔍 ProfileSetup useEffect - route.params:', route.params);
    console.log('🔍 ProfileSetup useEffect - routeKakaoId:', routeKakaoId);
    console.log('🔍 ProfileSetup useEffect - routeKakaoId 타입:', typeof routeKakaoId);
    
    if (location) setLocation(location);
    if (nickname) setNickname(nickname);
    if (userType !== undefined) setUserType(userType);
    if (selectedCakes) setSelectedCakes(selectedCakes);
    if (routeKakaoId && !kakaoId) { // ✅ kakaoId가 없을 때만 설정
      console.log('🔍 ProfileSetup - kakaoId 상태 설정:', routeKakaoId);
      setKakaoId(routeKakaoId);
    }
  }, [route.params, kakaoId]); // ✅ kakaoId 의존성 추가

  const handleCakeSelection = (variantId: number) => {
    if (selectedCakes.includes(variantId)) {
      setSelectedCakes(selectedCakes.filter((id) => id !== variantId));
    } else if (selectedCakes.length < 3) {
      setSelectedCakes([...selectedCakes, variantId]);
    }
  };

  const handleLogin = async () => {
    if (!nickname || !location || !userType) {
      Alert.alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      // 카카오 회원가입만 처리 (kakaoId는 필수)
      console.log(" ProfileSetup - route.params:", route.params);
      console.log(" ProfileSetup - kakaoId 상태:", kakaoId);
      console.log(" ProfileSetup - kakaoId 타입:", typeof kakaoId);
      
      if (!kakaoId) {
        Alert.alert("오류", "카카오 로그인 정보가 없습니다.");
        return;
      }

      console.log("🎯 카카오 회원가입 진행:", { kakaoId, nickname, location, userType });
      console.log("🎯 selectedCakes:", selectedCakes);
      
      const response = await registerKakaoUser(
        kakaoId,
        nickname,
        location,
        userType,
        selectedCakes
      );

      const createdUserId = response.user?.userId || response.user?.id;

      if (!createdUserId) {
        throw new Error("userId가 응답에 없습니다.");
      }

      console.log("카카오 회원가입 성공:", response);

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainScreen",
            params: {
              userType,
              userId: createdUserId,
            },
          } as never,
        ],
      });
    } catch (error) {
      console.error("카카오 회원가입 실패:", error);
      Alert.alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <BackHeader title="프로필 설정" onBack={() => navigation.goBack()} />
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <ProfileAvatar />
        </View>

        <View style={styles.inputContainer}>
          <InputField
            placeholder="닉네임"
            value={nickname}
            onChangeText={setNickname}
          />
          <InputField
            placeholder="관심 지역"
            value={location}
            onChangeText={setLocation}
            showArrow
                         onPressArrow={() =>
               navigation.navigate("RegionSelection", {
                 previousData: {
                   nickname,
                   userType,
                   selectedCakes,
                   kakaoId, // ✅ kakaoId 추가
                 },
               })
             }
          />
        </View>

        <UserTypeSection selectedType={userType} onSelectType={setUserType} />

        <CakePreferencesSection
          cakeOptions={randomCakes}
          selectedCakes={selectedCakes}
          onSelectCake={handleCakeSelection}
        />

        <PrimaryButton title="로그인" onPress={handleLogin} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    maxWidth: 390,
    paddingTop: 46,
    paddingRight: 18,
    paddingBottom: 46,
    paddingLeft: 18,
    flexDirection: "column",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 20,
  },
});

export default ProfileSetupScreen;
