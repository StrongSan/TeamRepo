import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { updateMyProfile } from '../api/userAPI';

type RouteP = RouteProp<RootStackParamList, 'ProfileEdit'>;

const ProfileEditScreen: React.FC = () => {
  const route = useRoute<RouteP>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userId, userType } = route.params;

  const [nickname, setNickname] = useState('');
  const [favoriteArea, setFavoriteArea] = useState('');
  const [userName, setUserName] = useState('');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    try {
      setSaving(true);
      await updateMyProfile({ nickname: nickname || undefined, favoriteArea: favoriteArea || undefined, userName: userName || undefined });
      Alert.alert('완료', '프로필이 저장되었습니다.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('오류', '프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>프로필 수정</Text>
      <View style={styles.field}> 
        <Text style={styles.label}>닉네임</Text>
        <TextInput value={nickname} onChangeText={setNickname} placeholder="닉네임" style={styles.input} />
      </View>
      <View style={styles.field}> 
        <Text style={styles.label}>선호 지역</Text>
        <TextInput value={favoriteArea} onChangeText={setFavoriteArea} placeholder="예: 청주" style={styles.input} />
      </View>
      <View style={styles.field}> 
        <Text style={styles.label}>이름</Text>
        <TextInput value={userName} onChangeText={setUserName} placeholder="이름" style={styles.input} />
      </View>

      <TouchableOpacity style={[styles.button, saving && { opacity: 0.7 }]} onPress={onSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? '저장 중...' : '저장하기'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, gap: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#222' },
  field: { gap: 8 },
  label: { fontSize: 13, color: '#666' },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E78182',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default ProfileEditScreen;


