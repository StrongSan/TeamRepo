import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import TopBar from "../components/TopBar";
import ProfileCard from '../components/ProfileCard';
import SettingsSection from '../components/SettingsSection';
import OrderSection from '../components/OrderSection';



export const SellerMypage: React.FC = () => {
  return (
    <>
    <TopBar title="마이페이지" />

    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <ProfileCard />
        <View style={styles.sectionsContainer}>
          <SettingsSection />
          <OrderSection />
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
    display: 'flex',
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

export default SellerMypage;
