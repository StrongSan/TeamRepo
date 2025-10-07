import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import TopBar from '../components/TopBar';
import { getOrderDetail, OrderDetailResponse, cancelOrder } from '../api/orderAPI';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

export default function OrderDetailScreen({ navigation, route }: Props) {
  const { orderId, userId } = route.params;
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await getOrderDetail(orderId);
      setOrderDetail(response);
    } catch (error) {
      console.error('주문 상세 조회 실패:', error);
      Alert.alert('오류', '주문 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      '주문 취소',
      '정말로 이 주문을 취소하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '예',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelOrder(orderId);
              Alert.alert('성공', '주문이 취소되었습니다.');
              navigation.goBack();
            } catch (error) {
              console.error('주문 취소 실패:', error);
              Alert.alert('오류', '주문 취소에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  const handleInquiry = async () => {
    if (!orderDetail) return;
    
    try {
      // 주문의 케이크 정보에서 postId를 가져와서 채팅방 생성/이동
      const { postId } = orderDetail.cakeInfo;
      
      // 채팅방 생성 또는 기존 채팅방 찾기
      const { createOrGetChatRoom } = await import('../api/chatAPI');
      const chatRoom = await createOrGetChatRoom(postId, parseInt(userId));
      
      // ChatRoom으로 이동
      navigation.navigate('ChatRoom', {
        roomId: chatRoom.roomId.toString(),
        userId,
        userType: 'customer', // 주문자는 customer
        productId: postId,
        isNewRoom: true
      });
    } catch (error) {
      console.error('문의하기 실패:', error);
      Alert.alert('오류', '문의하기 기능을 사용할 수 없습니다.');
    }
  };

  const handleReorder = () => {
    // TODO: 재주문 기능 구현
    Alert.alert('알림', '재주문 기능은 준비 중입니다.');
  };

  const handleWriteReview = () => {
    navigation.navigate('WriteReview', { orderId, userId });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar title="주문 상세" onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E78182" />
          <Text style={styles.loadingText}>주문 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!orderDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar title="주문 상세" onBackPress={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>주문 정보를 불러올 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar title="주문 상세" onBackPress={() => navigation.goBack()} />
      
      <ScrollView style={styles.content}>
        {/* 주문 상태 */}
        <View style={styles.statusSection}>
          <Text style={styles.statusTitle}>주문 상태</Text>
          <View style={styles.statusBadge}>
            <Text style={[
              styles.statusText,
              orderDetail.status === 'IN_PROGRESS' ? styles.statusInProgress : styles.statusCompleted
            ]}>
              {orderDetail.status === 'IN_PROGRESS' ? '진행 중' : '완료'}
            </Text>
          </View>
        </View>

        {/* 케이크 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주문 상품</Text>
          <View style={styles.cakeInfo}>
            <Image 
              source={{ 
                uri: orderDetail.thumbnail 
                  ? (orderDetail.thumbnail.startsWith('http') 
                      ? orderDetail.thumbnail 
                      : `http://172.30.176.1:8080/images/${orderDetail.thumbnail}`)
                  : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&h=80&fit=crop&crop=center'
              }} 
              style={styles.cakeImage}
              onError={(error) => {
                console.log('주문 상세 이미지 로드 실패:', error.nativeEvent.error);
                console.log('변환된 URL:', orderDetail.thumbnail 
                  ? (orderDetail.thumbnail.startsWith('http') 
                      ? orderDetail.thumbnail 
                      : `http://172.30.176.1:8080/images/${orderDetail.thumbnail}`)
                  : 'fallback');
              }}
              onLoad={() => console.log('주문 상세 이미지 로드 성공:', orderDetail.thumbnail)}
            />
            <View style={styles.cakeDetails}>
              <Text style={styles.cakeTitle}>{orderDetail.title}</Text>
              <Text style={styles.cakeOptions}>{orderDetail.options}</Text>
              <Text style={styles.cakePrice}>{formatKRW(Number(orderDetail.price))}원</Text>
            </View>
          </View>
        </View>

        {/* 주문 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주문 정보</Text>
          <InfoRow label="주문 번호" value={orderDetail.id} />
          <InfoRow label="주문 일시" value={orderDetail.orderDate} />
          <InfoRow label="픽업 날짜" value={orderDetail.pickupDate} />
        </View>

        {/* 고객 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>고객 정보</Text>
          <InfoRow label="이름" value={orderDetail.customerInfo.name} />
          <InfoRow label="연락처" value={orderDetail.customerInfo.phone} />
        </View>

        {/* 케이크 상세 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>케이크 상세</Text>
          <InfoRow label="상품명" value={orderDetail.cakeInfo.title} />
          <InfoRow label="설명" value={orderDetail.cakeInfo.description} />
        </View>

        {/* 주문 옵션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주문 옵션</Text>
          <InfoRow label="변형 ID" value={orderDetail.orderOptions.variantId.toString()} />
          <InfoRow label="시트 ID" value={orderDetail.orderOptions.sheetId.toString()} />
          <InfoRow label="필링 ID" value={orderDetail.orderOptions.fillingId.toString()} />
          <InfoRow label="사이즈 ID" value={orderDetail.orderOptions.sizeId.toString()} />
          <InfoRow label="타입 ID" value={orderDetail.orderOptions.typeId.toString()} />
        </View>
      </ScrollView>

      {/* 액션 버튼들 */}
      <View style={styles.actionButtons}>
        {orderDetail.status === 'IN_PROGRESS' ? (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={handleInquiry}>
              <Text style={styles.actionButtonText}>문의하기</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={handleCancelOrder}
            >
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>주문 취소</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={handleReorder}>
              <Text style={styles.actionButtonText}>재주문</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleWriteReview}>
              <Text style={styles.actionButtonText}>후기 작성</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// 정보 행 컴포넌트
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// 가격 포맷팅 유틸리티
const formatKRW = (n: number) => n.toLocaleString('ko-KR');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E78182',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  statusInProgress: {
    backgroundColor: '#E78182',
  },
  statusCompleted: {
    backgroundColor: '#28a745',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  cakeInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  cakeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  cakeDetails: {
    flex: 1,
  },
  cakeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cakeOptions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cakePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E78182',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E78182',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E78182',
  },
  cancelButtonText: {
    color: '#E78182',
  },
});
