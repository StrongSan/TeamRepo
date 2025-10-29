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
import { getMyProfile, updateMyProfile, updateMyAvatar } from "../api/userAPI";
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
  const [editMode, setEditMode] = useState<boolean>(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [originalAvatarUri, setOriginalAvatarUri] = useState<string | null>(null);

  // ✅ 케이크 랜덤 추천 API 호출 (회원가입 플로우에서만 필요)
  useEffect(() => {
    if (editMode) return; // 편집 모드에서는 불필요
    const fetchRandomCakes = async () => {
      try {
        const response = await apiClient.get("/api/cake-posts/random");
        setRandomCakes(response.data);
      } catch (error) {
        console.error("랜덤 케이크 불러오기 실패", error);
      }
    };

    fetchRandomCakes();
  }, [editMode]);

  useEffect(() => {
    const { location, nickname, userType, selectedCakes, kakaoId: routeKakaoId, profileImg, editMode } = route.params || {};
    // route params 반영
    
    if (location) setLocation(location);
    if (nickname) setNickname(nickname);
    if (userType !== undefined) setUserType(userType);
    if (selectedCakes) setSelectedCakes(selectedCakes);
    if (typeof editMode === 'boolean') setEditMode(editMode);
    if (profileImg) {
      setAvatarUri(profileImg);
      setOriginalAvatarUri(profileImg);
    }
    if (routeKakaoId && !kakaoId) { // ✅ kakaoId가 없을 때만 설정
      console.log('🔍 ProfileSetup - kakaoId 상태 설정:', routeKakaoId);
      setKakaoId(routeKakaoId);
    }
  }, [route.params, kakaoId]); // ✅ kakaoId 의존성 추가

  // 편집 모드일 때 현재 프로필 불러오기
  useEffect(() => {
    if (!editMode) return;
    (async () => {
      try {
        const me = await getMyProfile();
        if (me.nickname) setNickname(me.nickname);
        if (me.favoriteArea) setLocation(me.favoriteArea);
        if (me.userType) setUserType(me.userType);
        if (me.profileImg) {
          // 백엔드에서 반환하는 경로를 완전한 URL로 변환
          const fullImageUrl = me.profileImg.startsWith('http') 
            ? me.profileImg 
            : `http://172.19.208.1:8080${me.profileImg}`;
          setAvatarUri(fullImageUrl);
          setOriginalAvatarUri(fullImageUrl);
        }
      } catch (e) {
        console.log('프로필 불러오기 실패(편집 모드):', e);
      }
    })();
  }, [editMode]);

  const handleCakeSelection = (variantId: number) => {
    if (selectedCakes.includes(variantId)) {
      setSelectedCakes(selectedCakes.filter((id) => id !== variantId));
    } else if (selectedCakes.length < 3) {
      setSelectedCakes([...selectedCakes, variantId]);
    }
  };

  const handleLogin = async () => {
    // ✅ 편집 모드: 닉네임/지역만 필수
    if (editMode) {
      if (!nickname?.trim() || !location?.trim()) {
        Alert.alert("모든 항목을 입력해주세요.");
        return;
      }
      try {
        // 프로필 수정 저장
        await updateMyProfile({ nickname, favoriteArea: location, userName: undefined });
        if (avatarUri && avatarUri !== originalAvatarUri) {
          // 로컬 파일 URI를 FormData로 전송
          await updateMyAvatar(avatarUri);
        }
        Alert.alert('완료', '프로필이 저장되었습니다.');
        navigation.goBack();
      } catch (error) {
        console.error("프로필 저장 실패:", error);
        Alert.alert('오류', '프로필 저장 중 문제가 발생했습니다.');
      }
      return;
    }

    // ✅ 회원가입 플로우: 닉네임/지역/유형 필수
    if (!nickname?.trim() || !location?.trim() || !userType) {
      Alert.alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      // 카카오 회원가입만 처리 (kakaoId는 필수)
      
      if (!kakaoId) {
        Alert.alert("오류", "카카오 로그인 정보가 없습니다.");
        return;
      }

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
        <BackHeader title={editMode ? "프로필 수정" : "프로필 설정"} onBack={() => navigation.goBack()} />
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <ProfileAvatar imageUri={avatarUri} onChangeImage={setAvatarUri} />
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
                  kakaoId,
                  onConfirm: (region: string) => setLocation(region),
                } as any,
              })
            }
          />
        </View>

        {!editMode && (
          <>
            <UserTypeSection selectedType={userType} onSelectType={setUserType} />
            <CakePreferencesSection
              cakeOptions={randomCakes}
              selectedCakes={selectedCakes}
              onSelectCake={handleCakeSelection}
            />
          </>
        )}

        <PrimaryButton title={editMode ? "저장" : "로그인"} onPress={handleLogin} />
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
