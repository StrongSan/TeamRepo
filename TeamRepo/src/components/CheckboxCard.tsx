import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";

interface CheckboxCardProps {
  selected: boolean;
  image: any; //require로 받은 이미지
  onSelect: () => void;
}

const CheckboxCard: React.FC<CheckboxCardProps> = ({ selected, onSelect, image }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onSelect}>

      <Image source={image} style={styles.image} resizeMode="cover" />

      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <View style={styles.checkboxInner} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "49%",
    height: 164,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    position: "relative",
    marginBottom: 7,
    marginRight: 7,
    overflow: "hidden",
  },
  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#AEAEB2",
    position: "absolute",
    right: 9,
    top: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#E78182",
    borderColor: "#E78182",
  },
  checkboxInner: {
    width: 14,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "white",
    transform: [{ rotate: "-45deg" }],
    marginTop: -2,
  },
  image: {
    width: "100%",
    height: "100%",
  }
});

export default CheckboxCard;
