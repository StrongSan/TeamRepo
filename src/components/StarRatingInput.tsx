import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  label?: string;
  showLabel?: boolean;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  onRatingChange,
  label = '별점 평가',
  showLabel = true,
}) => {
  const ratingLabels: Record<number, string> = {
    1: '별로예요',
    2: '보통이에요',
    3: '괜찮아요',
    4: '좋아요',
    5: '최고예요',
  };

  return (
    <View style={styles.starRow}>
      {showLabel && <Text style={styles.sectionTitle}>{label}</Text>}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => onRatingChange(i)}>
            <Text style={[styles.starIcon, i <= rating && styles.starIconFilled]}>
              {i <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
        {rating > 0 && (
          <Text style={styles.ratingText}>{ratingLabels[rating]}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  starRow: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  starIcon: {
    fontSize: 32,
    color: '#ddd',
  },
  starIconFilled: {
    color: '#f5a623',
  },
  ratingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default StarRatingInput;
