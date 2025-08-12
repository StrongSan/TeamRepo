import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import TopBar from "../components/TopBar";
import OrderCard from "../components/OrderCard";
import KakaoPayButton from "../components/KakaoPayButton";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchPostById } from "../api/postAPI";
import OrderFlowModal from "../components/OrderFlowModal";

type PaymentRouteProp = RouteProp<RootStackParamList, "Payment">;

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<PaymentRouteProp>();
  const { postId } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'requested' | 'approved' | 'success'>('success');

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
        const data = await fetchPostById(postId); // ✅ API로 게시글 1개 가져오기
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

  const orderDetails = {
    orderDate: new Date().toISOString().split("T")[0],
    itemName: post.title,
    quantity: 1,
    totalPrice: post.price,
  };

  const handleOrderDetails = () => {};
  const handleInquiry = () => {};
  const handlePayment = () => {
    setModalType("success");
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  const handleNext = () => {
    setModalVisible(false);
    // TODO: 주문 완료 이후 동작 (예: 메인으로 이동)
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
          <KakaoPayButton onPress={handlePayment} />
        </View>
      </ScrollView>
      <OrderFlowModal
        visible={modalVisible}
        onClose={handleCloseModal}
        type={modalType}
        cakeName={post.title} // ✅ 정확한 제목 전달
        price={post.price}     // ✅ 정확한 가격 전달
        postId={postId}
        orderDate={orderDetails.orderDate} // ✅ 주문일시도 같이 전달
        onNext={handleNext}
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
