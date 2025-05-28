// src/screens/OrderDetailScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import TopBar from '../components/TopBar';

interface OrderDetailProps {
  order: {
    name: string;
    pickupDate: string;
    pickupTime: string;
    letteringText: string;
    size: string;
    shape: string;
    sheet: string;
    filling: string;
    notes: string;
    imageUris: string[];
    cakeTypes: string[];
  };
}

const OrderDetailScreen: React.FC<{ route: any }> = ({ route }) => {
  const { order } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <TopBar title="주문상세" onBackPress={() => {}} />
      <ScrollView contentContainerStyle={styles.content}>
        <LabelValue label="이름(픽업자)" value={order.name} />
        <LabelValue label="픽업 날짜" value={order.pickupDate} />
        <LabelValue label="픽업 시간" value={order.pickupTime} />
        <LabelValue label="레터링 문구" value={order.letteringText} />
        <LabelValue label="사이즈" value={order.size} />
        <LabelValue label="모양" value={order.shape} />
        <LabelValue label="시트/맛" value={`${order.sheet}/${order.filling}`} />
        <LabelValue label="기타 전달사항" value={order.notes} />

        <Text style={styles.sectionTitle}>참고 디자인</Text>
        {order.imageUris.map((uri: string, i: number) => (
          <Image key={i} source={{ uri }} style={styles.image} />
        ))}

        <Text style={styles.sectionTitle}>케이크 종류</Text>
        <View style={styles.typeList}>
          {order.cakeTypes.map((type: string, i: number) => (
            <Text key={i} style={styles.typeTag}>{type}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const LabelValue = ({ label, value }: { label: string; value: string }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  value: { fontSize: 16, color: '#333' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  image: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10 },
  typeList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeTag: {
    backgroundColor: '#FAD4D4',
    color: '#E78182',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default OrderDetailScreen;
