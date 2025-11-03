import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReviewResponse } from '../api/reviewAPI';

interface ReviewItemProps {
  review: ReviewResponse;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewRating}>
          {'★'.repeat(Math.floor(review.rating))}{'☆'.repeat(5 - Math.floor(review.rating))}
        </Text>
        <Text style={styles.reviewDate}>
          {new Date(review.createdAt).toLocaleDateString('ko-KR')}
        </Text>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewRating: {
    fontSize: 16,
    color: '#f5a623',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default ReviewItem;
