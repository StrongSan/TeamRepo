import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface OrderButtonProps {
    onCancel: () => void;
    onOrder: () => void;
  }  

  const OrderButton: React.FC<OrderButtonProps> = ({ onCancel, onOrder }) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.orderButton} onPress={onOrder}>
          <Text style={styles.orderText}>주문</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 25,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E78182",
    alignItems: "center",
  },
  orderButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E78182",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#E78182",
    fontFamily: "Roboto",
  },
  orderText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    fontFamily: "Roboto",
  },
});

export default OrderButton;
