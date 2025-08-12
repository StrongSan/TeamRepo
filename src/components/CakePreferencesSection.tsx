import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import CheckboxCard from "./CheckboxCard";
import ProfileCakeIcon from "../../assets/icons/profileCake-icon.svg";

interface Cake {
  variantId: number;
  imageUrl: string;
}

interface CakePreferencesSectionProps {
  cakeOptions: Cake[];
  selectedCakes: number[];
  onSelectCake: (variantId: number) => void;
}

const CakePreferencesSection: React.FC<CakePreferencesSectionProps> = ({
  cakeOptions,
  selectedCakes,
  onSelectCake,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ProfileCakeIcon width={24} height={24} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>내가 좋아하는 케이크는?</Text>
          <Text style={styles.subHeaderText}>1 ~ 3개 선택</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <FlatList
          data={cakeOptions}
          numColumns={2}
          renderItem={({ item }) => (
            <CheckboxCard
              selected={selectedCakes.includes(item.variantId)}
              image={{ uri: item.imageUrl }} // ✅ URI 방식으로 이미지 처리
              onSelect={() => onSelectCake(item.variantId)}
            />
          )}
          keyExtractor={(item) => item.variantId.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 19,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 5,
  },
  headerTextContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  headerText: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  subHeaderText: {
    color: "#7E7E7E",
    fontFamily: "Inter",
    fontSize: 12,
  },
  gridContainer: {
    width: "100%",
  },
  gridContent: {
    gap: 7,
  },
});

export default CakePreferencesSection;
