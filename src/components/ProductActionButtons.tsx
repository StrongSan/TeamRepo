import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const ProductActionButtons: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>수정하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>삭제하기</Text>
      </TouchableOpacity>
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
