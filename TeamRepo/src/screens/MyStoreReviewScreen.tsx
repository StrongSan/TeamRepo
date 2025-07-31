import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import TopBar from '../components/TopBar';
import StarFilled from '../../assets/icons/star-filled.svg';
import StarOutline from '../../assets/icons/star-outline.svg';

// 임시 리뷰 데이터
const reviews = [
  {
    id: '1',
    name: '이민영',
    cakeType: '떡 케이크',
    content: '쫀득쫀득하고 맛있어요 담에도 여기서 할거같아요 ㅎㅎ',
    rating: 3,
    date: '2025/03/29',
    images: [1, 2, 3],
  },
  {
    id: '2',
    name: '김강짱',
    cakeType: '유아용 케이크',
    content: '아이가 좋아해요~^^\n맛도 있고 보기에도 귀엽고~\n제주로 약속합니다',
    rating: 4,
    date: '2025/03/27',
    images: [1, 2],
  },
];

const renderStars = (score: number) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= score ? (
          <StarFilled width={16} height={16} key={i} />
        ) : (
          <StarOutline width={16} height={16} key={i} />
        )
      )}
    </View>
  );
};

const MyStoreReviewScreen = () => {
  const averageScore = 3.0;

  return (
    <View style={styles.container}>
      <TopBar title="내 가게 리뷰" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatar} />
          <Text style={styles.name}>cakeee</Text>
          <Text style={styles.averageScore}>{averageScore.toFixed(1)}</Text>
          {renderStars(3)}
        </View>

        <Text style={styles.reviewCount}>8개의 리뷰</Text>

        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <Text style={styles.reviewerName}>{review.name}</Text>
            <Text style={styles.cakeType}>{review.cakeType}</Text>
            <View style={{ flexDirection: 'row', marginVertical: 4 }}>
              {renderStars(review.rating)}
            </View>
            <Text style={styles.reviewContent}>{review.content}</Text>
            <View style={styles.reviewImagesContainer}>
              {review.images.map((_, idx) => (
                <View key={idx} style={styles.imagePlaceholder} />
              ))}
            </View>
            <View style={styles.reviewFooter}>
              <Text style={styles.reviewDate}>{review.date}</Text>
              <TouchableOpacity>
                <Text style={styles.deleteText}>리뷰 삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MyStoreReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D9D9D9',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
  },
  averageScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  reviewCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  reviewCard: {
    paddingVertical: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  cakeType: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  reviewContent: {
    fontSize: 14,
    color: '#333',
    marginVertical: 6,
  },
  reviewImagesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteText: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'underline',
  },
});
