import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";


const SellerHeader: React.FC = () => {
  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.backButtonContainer}>
          <Image source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/1a0ed0d0acc2cb311b68162a26f192252ab1cc98?placeholderIfAbsent=true&apiKey=22b54abd138245f5857096ad134e8a56" }} style={styles.backIcon} />
        </View>
      </View>
      <View style={styles.sellerInfoContainer}>
        <View style={styles.sellerInfo}>
          <View style={styles.profileImage} />
          <View style={styles.sellerNameContainer}>
            <Text style={styles.sellerName}>Cakeee</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignSelf: "stretch",
    display: "flex",
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
  },
  backButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backIcon: {
    aspectRatio: 1,
    objectFit: "contain",
    width: 24,
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
  },
  sellerInfoContainer: {
    display: "flex",
    marginTop: 0,
    width: "100%",
    maxWidth: 332,
    alignItems: "center",
    fontFamily: "Inder, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 18,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "400",
    letterSpacing: -0.17,
    justifyContent: "space-between",
  },
  sellerInfo: {
    alignSelf: "stretch",
    display: "flex",
    marginTop: "auto",
    marginBottom: "auto",
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
  },
  profileImage: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    alignSelf: "stretch",
    display: "flex",
    marginTop: "auto",
    marginBottom: "auto",
    width: 37,
    height: 35,
    backgroundColor: "#ccc", 
  },
  sellerNameContainer: {
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
    width: 61,
  },
  sellerName: {
    fontFamily: "Inder, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 18,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "400",
  },
});

export default SellerHeader;
