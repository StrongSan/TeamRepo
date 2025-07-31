import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import TopBar from "../components/TopBar";
import ProfileCard from '../components/ProfileCard';
import SettingsSection from '../components/SettingsSection';
import OrderSection from '../components/OrderSection';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type MypageRouteProp = RouteProp<RootStackParamList, 'MypageScreen'>;

const MypageScreen: React.FC = () => {
  const route = useRoute<MypageRouteProp>();
  const { userType } = route.params; // 

  return (
    <>
      <TopBar title="마이페이지" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <ProfileCard />
          <View style={styles.sectionsContainer}>
            <SettingsSection />
            {userType === 'seller' ? (
              <OrderSection userType="seller" />
            ) : (
              <OrderSection userType="customer" />
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 480,
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 252,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sectionsContainer: {
    marginTop: 24,
    gap: 16,
  },
});

export default MypageScreen;
