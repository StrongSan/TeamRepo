import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FilledStar from "../../assets/icons/star-filled.svg";
import OutlineStar from "../../assets/icons/star-outline.svg";

interface RatingDisplayProps {
  rating: number;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ rating }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>후기</Text>
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < Math.floor(rating);
          const Star = filled ? FilledStar : OutlineStar;
          return <Star key={i} width={24} height={24} />;
        })}
      </View>
      <Text style={styles.ratingText}>({rating.toFixed(1)})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
  },
});

export default RatingDisplay;
