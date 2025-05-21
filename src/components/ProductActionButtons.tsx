import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  userType: "seller" | "customer";
};

const ProductActionButtons: React.FC<Props> = ({ userType }) => {
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
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>문의하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filledButton}>
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
