import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuOption from './MenuOption';
import SettingsIcon from '../../assets/icons/settings.svg';
import ArrowRightIcon from '../../assets/icons/arrowRight.svg';
import ProfileIcon from '../../assets/icons/profile-icon.svg'

console.log('MenuOption is a', typeof MenuOption);
console.log('SettingsIcon:', SettingsIcon);
console.log('ProfileIcon:', ProfileIcon);
console.log('ArrowRightIcon:', ArrowRightIcon);

const SettingsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>일반</Text>

      <MenuOption
        icon={ProfileIcon}
        title="프로필 수정"
        rightIcon={ArrowRightIcon}
      />
      <MenuOption
        icon={SettingsIcon}
        title="설정"
        rightIcon={ArrowRightIcon}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#70756b',
    fontFamily: 'Poppins',
    fontWeight: '600',
    lineHeight: 20.4,
    paddingHorizontal: 8,
  },
});

export default SettingsSection;