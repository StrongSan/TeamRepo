import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { createOrGetChatRoom } from "../api/chatAPI";

type Props = {
  userType: "seller" | "customer";
  postId: number;
  userId: string;
  price?: string; // 가격 정보 추가
};

const ProductActionButtons: React.FC<Props> = ({ userType, postId, userId, price }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 문의하기 버튼 클릭 핸들러
  const handleInquiry = async () => {
    try {
      console.log("🔍 문의하기 요청:", { postId, userId });
      
      const response = await createOrGetChatRoom(postId, parseInt(userId));
      
      console.log("✅ 채팅방 응답:", response);
      
      // 채팅방으로 이동
      navigation.navigate("ChatRoom", {
        roomId: response.roomId,
        sellerId: response.sellerId,
        customerId: response.customerId,
        productId: response.productId,
        userId: userId,
        userType: userType,
        isNewRoom: response.isNewRoom,
        messageCount: response.messageCount
      });
      
    } catch (error) {
      console.error("❌ 문의하기 실패:", error);
      Alert.alert("오류", "문의하기 요청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <View style={styles.container}>
      {userType === "seller" ? (
        <>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>수정하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filledButton}>
            <Text style={styles.filledButtonText}>삭제하기</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.outlineButton} onPress={handleInquiry}>
            <Text style={styles.outlineButtonText}>문의하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filledButton}
            onPress={() => navigation.navigate("CakeOrderForm", { postId, userId, userType, price })}
          >
            <Text style={styles.filledButtonText}>주문하기</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "90%",
    maxWidth: 360,
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E78182",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonText: {
    color: "#E78182",
    fontSize: 16,
    fontWeight: "600",
  },
  filledButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#E78182",
    alignItems: "center",
    justifyContent: "center",
  },
  filledButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductActionButtons;