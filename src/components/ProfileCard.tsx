import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ArrowIcon from '../../assets/icons/allowLeft.svg';

const ProfileCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <View style={styles.infoContainer}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>cakeee</Text>
          <Text style={styles.location}>청주</Text>
        </View>
      </View>
      {/*  프로필 수정하러 가는 화살표표
      <View style={styles.iconContainer}>
        <ArrowIcon width={24} height={24} />
      </View>
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    marginTop: 39,
    width: '100%',
    gap: 16,
    flexDirection: 'row',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 72,
    borderWidth: 1,
    borderColor: 'rgba(145, 149, 142, 0.06)',
    backgroundColor: '#C4C4C4',
  },
  infoContainer: {
    flex: 1,
    gap: 8,
  },
  userInfo: {
    gap: 4,
  },
  username: {
    color: '#363a33',
    fontSize: 17,
    fontFamily: 'Poppins',
    fontWeight: '700',
    letterSpacing: -0.17,
  },
  location: {
    color: '#70756b',
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '500',
    marginTop: 4,
  },
  iconContainer: {
    padding: 20,
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default ProfileCard;