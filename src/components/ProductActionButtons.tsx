import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";

type Props = {
  userType: "seller" | "customer";
};

const ProductActionButtons: React.FC<Props> = ({ userType }) => {
  const handleEdit = () => {
    Alert.alert("수정하기 버튼 눌림");
  };

  const handleDelete = () => {
    Alert.alert("삭제하기 버튼 눌림");
  };

  const handleInquiry = () => {
    Alert.alert("문의하기 버튼 눌림");
  };

  const handleOrder = () => {
    Alert.alert("주문하기 버튼 눌림");
  };

  return (
    <View style={styles.container}>
      {userType === "seller" ? (
        <>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>수정하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>삭제하기</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.editButton} onPress={handleInquiry}>
            <Text style={styles.editButtonText}>문의하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleOrder}>
            <Text style={styles.deleteButtonText}>주문하기</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
    maxWidth: 354,
    alignSelf: "center",
    gap: 14,
  },
  editButton: {
    width: 160,
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E78182",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: "#E78182",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    width: 160,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#E78182",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductActionButtons;
