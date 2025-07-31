import * as React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import BackHeader from "../components/BackHeader";
import RegionList from "../components/RegionList";
import ConfirmButton from "../components/ConfirmButton";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useRoute, RouteProp } from '@react-navigation/native';

const RegionSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>(["서울"]);

  const toggleRegionSelection = (region: string) => {
    setSelectedRegions([region]);
  };
  const route = useRoute<RouteProp<RootStackParamList, 'RegionSelection'>>();
  const previousData = route.params?.previousData;
  
  const handleConfirm = () => {
    if (!selectedRegions[0]) {
      Alert.alert('지역 선택', '관심 지역을 선택해주세요.');
      return;
    }
  
    
    navigation.navigate('ProfileSetup', {
      location: selectedRegions[0],
      nickname: previousData?.nickname,
      userType: previousData?.userType,
      selectedCakes: previousData?.selectedCakes,
    });
  };
    return (
      <View style={styles.container}>
        <BackHeader title="관심 지역 설정" onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <RegionList
            selectedRegions={selectedRegions}
            onToggleRegion={toggleRegionSelection}
          />
          <ConfirmButton onPress={handleConfirm} />
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    maxWidth: 390,
    display: "flex",
    flexDirection: "column",
    paddingTop: 58,
    paddingRight: 18,
    paddingBottom: 43,
    paddingLeft: 18,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 29,
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 23,
    letterSpacing: -0.3,
  },
});

export default RegionSelectionScreen;
