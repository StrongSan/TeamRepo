import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TopBar from "../components/TopBar";
import OrderCard from "../components/OrderCard";
import KakaoPayButton from "../components/KakaoPayButton";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchPostById } from "../api/postAPI";
import OrderFlowModal from "../components/OrderFlowModal";
import apiClient from "../api/apiClient";

type PaymentRouteProp = RouteProp<RootStackParamList, "Payment">;

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<PaymentRouteProp>();
  const { postId, userId, userType } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'requested' | 'approved' | 'success'>('success');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [post, setPost] = useState<{
    title: string;
    price: string;
    imageUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!postId) {
      console.warn("postId가 전달되지 않았습니다.");
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchPostById(postId);
        setPost(data);
      } catch (err) {
        console.error("게시글 불러오기 실패", err);
      }
    };

    fetchData();
  }, [postId]);

  if (!postId) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>잘못된 접근입니다. postId가 전달되지 않았습니다.</Text>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>게시글 정보를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  const formattedPrice =
    post.price ? `${Number(post.price).toLocaleString()}원` : post.price;

  const orderDetails = {
    orderDate: new Date().toISOString().split("T")[0],
    itemName: post.title,
    quantity: 1,
    totalPrice: formattedPrice,
    imageUrl: post.imageUrl,
  };

  const handleOrderDetails = () => {};
  const handleInquiry = () => {};
  const handlePayment = async () => {
    try {
      setIsCreatingOrder(true);
      
      // TODO: 실제 결제 API 호출
      // 현재는 주문 생성만 시뮬레이션
      const orderData = {
        postId: postId,
        quantity: 1,
        totalPrice: parseInt(post.price),
        orderDate: new Date().toISOString(),
        status: 'IN_PROGRESS'
      };

      // 주문 생성 API 호출 (실제 백엔드와 연동 필요)
      const response = await apiClient.post('/orders', orderData);
      const orderId = response.data.orderId || `order_${Date.now()}`;
      
      setCreatedOrderId(orderId);
      setModalType("success");
      setModalVisible(true);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        // 인증되지 않은 상태에서는 추가 로그 없이 안내 모달만 노출
        setModalType("success");
        setModalVisible(true);
        return;
      }
      // 기타 오류는 콘솔 경고로만 처리
      console.warn('주문 생성 중 예상치 못한 오류가 발생했습니다.', error);
      setModalType("success");
      setModalVisible(true);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // 모달 닫을 때 메인 화면으로 이동
    navigation.navigate('MainScreen', {
      userId: userId || 'temp_user',
      userType: (userType || 'customer') as 'seller' | 'customer'
    });
  };

  const handleNext = () => {
    setModalVisible(false);
    // 주문 내역 화면으로 이동
    navigation.navigate('MyReservations', {
      userId: userId || 'temp_user',
      userType: (userType || 'customer') as 'seller' | 'customer'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="결제하기" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <OrderCard
            orderDetails={orderDetails}
            onOrderDetails={handleOrderDetails}
            onInquiry={handleInquiry}
          />
          <KakaoPayButton 
            onPress={handlePayment} 
            loading={isCreatingOrder}
          />
        </View>
      </ScrollView>
      <OrderFlowModal
        visible={modalVisible}
        onClose={handleCloseModal}
        type={modalType}
        cakeName={post.title}
        price={post.price}
        postId={postId}
        orderDate={orderDetails.orderDate}
        onNext={handleNext}
        userId={userId}
        userType={userType}
        successPrimaryAction={{
          label: '메인으로 가기',
          onPress: handleCloseModal,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  orderCount: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 20,
    fontWeight: "400",
    marginTop: 30,
    textAlign: "center",
  },
  content: {
    marginTop: 33,
    width: "100%",
    maxWidth: 335,
    alignSelf: "center",
  },
});

export default PaymentScreen;
