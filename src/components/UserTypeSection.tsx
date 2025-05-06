import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RadioOption from './RadioOption';
import UserIcon from "../../assets/icons/user-icon.svg";

interface UserTypeSectionProps {
  selectedType: "seller" | "customer" | null;
  onSelectType: (type: "seller" | "customer") => void;
}

const UserTypeSection: React.FC<UserTypeSectionProps> = ({
  selectedType,
  onSelectType,
}) => {
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <UserIcon width={15} height={21} />
        <Text style={styles.headerText}>나는 사장님? 손님?</Text>
      </View>

      <View style={styles.optionsContainer}>
        <RadioOption
          label="사장님이에요"
          selected={selectedType === "seller"}
          onSelect={() => onSelectType("seller")}
        />
        <RadioOption
          label="손님이에요"
          selected={selectedType === "customer"}
          onSelect={() => onSelectType("customer")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 13,
    marginBottom: 20,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 5,
  },
  headerText: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 10,
    gap: 26,
  },
});

export default UserTypeSection;
