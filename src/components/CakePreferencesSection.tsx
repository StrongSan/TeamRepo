import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import CheckboxCard from "./CheckboxCard";
import ProfileCakeIcon from "../../assets/icons/profileCake-icon.svg";

interface CakePreferencesSectionProps {
  selectedCakes: number[];
  onSelectCake: (index: number) => void;
}

const cakeImages = [
  require("../../assets/images/pre_cho1.jpg"),
  require("../../assets/images/pre_cho2.jpg"),
  require("../../assets/images/pre_stcho.jpg"),
  require("../../assets/images/pre_figure.jpg"),
  require("../../assets/images/pre_letter.jpg"),
  require("../../assets/images/pre_flower.jpg"),
  require("../../assets/images/pre_fru.jpg"),
  require("../../assets/images/pre_rice.jpg"),
]

const CakePreferencesSection: React.FC<CakePreferencesSectionProps> = ({
  selectedCakes,
  onSelectCake,
}) => {
  


  const cakeOptions = cakeImages.map((img, index) => ({
    id: index,
    image: img,
    selected: selectedCakes.includes(index),
  }));

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
              selected={item.selected}
              image={item.image}
              onSelect={() => onSelectCake(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
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
