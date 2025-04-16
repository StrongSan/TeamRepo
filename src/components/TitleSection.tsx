import * as React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import MiniCake from '../../assets/icons/miniCake.svg';

const TitleSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <MiniCake style={styles.logo} />
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>CakedaY</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 70,
    paddingBottom: 8,
    gap: 8,
    overflow: "hidden",
    backgroundColor: "#FFF",
  },
  titleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  logo: {
    aspectRatio: 1.44,
    objectFit: "contain",
    width: 46,
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
    flexShrink: 0,
  },
  titleTextContainer: {
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
  },
  titleText: {
    fontSize: 32,
    color: "rgba(217, 98, 100, 1)",
    fontWeight: "600",
  },
});

export default TitleSection;
