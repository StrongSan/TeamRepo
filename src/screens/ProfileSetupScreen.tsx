import React, { useState, useEffect } from "react";
import {View, StyleSheet, ScrollView} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Alert } from "react-native";
import BackHeader from "../components/BackHeader";
import ProfileAvatar from "../components/ProfileAvatar";
import InputField from "../components/InputField";
import UserTypeSection from "../components/UserTypeSection";
import CakePreferencesSection from "../components/CakePreferencesSection";
import PrimaryButton from "../components/PrimaryButton";
import { submitProfile } from '../api/profileAPI'

type ProfileSetupRouteProp = RouteProp<RootStackParamList, 'ProfileSetup'>;

const ProfileSetupScreen: React.FC = () => {
  const route = useRoute<ProfileSetupRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState("");
  const [userType, setUserType] = useState<"owner" | "customer" | null>(null);
  const [selectedCakes, setSelectedCakes] = useState<number[]>([]);

  useEffect(() => {
    const { location, nickname, userType, selectedCakes } = route.params || {};
  
    if (location) setLocation(location);
    if (nickname) setNickname(nickname);
    if (userType !== undefined) setUserType(userType);
    if (selectedCakes) setSelectedCakes(selectedCakes);
  }, [route.params]);

  const handleCakeSelection = (index: number) => {
    if (selectedCakes.includes(index)) {
      setSelectedCakes(selectedCakes.filter((item) => item !== index));
    } else {
      if (selectedCakes.length < 3) {
        setSelectedCakes([...selectedCakes, index]);
      }
    }
  };

  const handleLogin = async () => {
    if (!nickname || !location || !userType) {
      Alert.alert("모든 항목을 입력해주세요.");
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" as never }],
    });
    try {
      const response = await submitProfile({
        nickname,
        location,
        userType,
        selectedCakes,
      });
  
      console.log("프로필 저장 성공:", response);
      
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      Alert.alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <BackHeader 
        title="프로필 설정"
        onBack={() => navigation.goBack()} />
      <View style={{alignItems: "center", marginBottom: 20}}>
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
              navigation.navigate('RegionSelection', {
                previousData: {
                  nickname,
                  userType,
                  selectedCakes,
                },
              })
            } 
          />
        </View>

        <UserTypeSection
          selectedType={userType}
          onSelectType={(type) => setUserType(type)}
        />

        <CakePreferencesSection
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