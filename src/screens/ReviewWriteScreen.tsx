import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Icon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { createReview, ReviewCreateRequest } from '../api/reviewAPI';
import { getOrderDetail, OrderDetailResponse } from '../api/orderAPI';
import { launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'WriteReview'>;

const cakeTypes = [
  '레터링 케이크',
  '떡 케이크',
  '유아용 케이크',
  '포토 케이크',
  '이벤트 케이크',
  '플라워 케이크',
  '웨딩 케이크',
  '2단 케이크',
  '기타',
];

const ReviewWriteScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderInfo, setOrderInfo] = useState<OrderDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 주문 정보 가져오기
    loadOrderInfo();
  }, []);

  const loadOrderInfo = async () => {
    try {
      setIsLoading(true);
      const orderData = await getOrderDetail(orderId);
      setOrderInfo(orderData);
    } catch (error) {
      console.error('주문 정보 로드 오류:', error);
      Alert.alert('오류', '주문 정보를 불러오는 중 오류가 발생했습니다.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleImageAdd = () => {
    const remainingSlots = 5 - images.length;
    
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: remainingSlots,
        quality: 0.8,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets.length > 0) {
          const newImages = response.assets.map((asset: Asset) => asset.uri).filter(Boolean) as string[];
          setImages(prev => [...prev, ...newImages]);
        }
      }
    );
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (rating === 0) {
      Alert.alert('알림', '별점을 선택해주세요.');
      return false;
    }
    if (title.trim().length === 0) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return false;
    }
    if (content.trim().length === 0) {
      Alert.alert('알림', '리뷰 내용을 입력해주세요.');
      return false;
    }
    if (title.trim().length > 100) {
      Alert.alert('알림', '제목은 100자 이내로 입력해주세요.');
      return false;
    }
    if (content.trim().length > 1000) {
      Alert.alert('알림', '리뷰 내용은 1000자 이내로 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !orderInfo) return;

    setIsSubmitting(true);
    try {
      const reviewData: ReviewCreateRequest = {
        userId: parseInt(orderInfo.customerInfo.name), // TODO: 실제 userId 사용
        cakeId: orderInfo.cakeInfo.postId,
        rating: rating,
        comment: `${title}\n\n${content}\n\n케이크 종류: ${selectedTypes.join(', ')}`,
      };

      await createReview(reviewData);
      
      Alert.alert(
        '성공',
        '리뷰가 성공적으로 등록되었습니다.',
        [
          {
            text: '확인',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('리뷰 작성 오류:', error);
      Alert.alert('오류', '리뷰 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => (
    <View style={styles.starRow}>
      <Text style={styles.sectionTitle}>별점 평가</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Text style={[styles.starIcon, i <= rating && styles.starIconFilled]}>
              {i <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
        {rating > 0 && (
          <Text style={styles.ratingText}>
            {rating === 1 ? '별로예요' : 
             rating === 2 ? '보통이에요' : 
             rating === 3 ? '괜찮아요' : 
             rating === 4 ? '좋아요' : '최고예요'}
          </Text>
        )}
      </View>
    </View>
  );

  const renderImages = () => (
    <View style={styles.imageSection}>
      <Text style={styles.sectionTitle}>사진 첨부 (선택)</Text>
      <Text style={styles.imageSubtitle}>최대 5장까지 업로드 가능</Text>
      <View style={styles.imageRow}>
        {images.map((uri, idx) => (
          <View key={idx} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.uploadedImage} resizeMode="cover" />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => removeImage(idx)}
            >
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        {images.length < 5 && (
          <TouchableOpacity
            style={styles.addImageBox}
            onPress={handleImageAdd}
            activeOpacity={0.8}
          >
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.addImageText}>사진 추가</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCakeTypes = () => (
    <View style={styles.typeSection}>
      <Text style={styles.sectionTitle}>케이크 종류 (선택)</Text>
      <View style={styles.typeWrap}>
        {cakeTypes.map((type) => {
          const active = selectedTypes.includes(type);
          return (
            <TouchableOpacity
              key={type}
              style={[styles.typeTag, active && styles.typeTagActive]}
              onPress={() => toggleType(type)}
            >
              <Text style={[styles.typeText, active && styles.typeTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>리뷰 작성</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e78282" />
          <Text style={styles.loadingText}>주문 정보를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  if (!orderInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>리뷰 작성</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>주문 정보를 불러올 수 없습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>리뷰 작성</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 주문 정보 미리보기 */}
        <View style={styles.orderPreview}>
          <Image source={{ uri: orderInfo.cakeInfo.imageUrl }} style={styles.cakePreviewImage} />
          <View style={styles.orderInfo}>
            <Text style={styles.cakeTitle}>{orderInfo.cakeInfo.title}</Text>
            <Text style={styles.orderIdText}>주문번호: {orderId}</Text>
            <Text style={styles.orderDateText}>픽업일: {orderInfo.pickupDate}</Text>
          </View>
        </View>

        {/* 별점 */}
        {renderStarRating()}

        {/* 제목 */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>제목 *</Text>
          <TextInput
            style={styles.input}
            placeholder="리뷰 제목을 입력해주세요"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        {/* 내용 */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>리뷰 내용 *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="케이크에 대한 솔직한 후기를 작성해주세요"
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{content.length}/1000</Text>
        </View>

        {/* 이미지 업로드 */}
        {renderImages()}

        {/* 케이크 종류 */}
        {renderCakeTypes()}

        {/* 등록 버튼 */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>리뷰 등록</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  starIcon: {
    fontSize: 32,
    color: '#ddd',
  },
  starIconFilled: {
    color: '#f5a623',
  },
  removeIcon: {
    fontSize: 20,
    color: '#ff4444',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  cameraIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderPreview: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginVertical: 16,
    gap: 12,
  },
  cakePreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cakeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  orderDateText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  starRow: {
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputSection: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  removeImageBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  addImageBox: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  addImageText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  typeSection: {
    marginBottom: 32,
  },
  typeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeTag: {
    borderWidth: 1,
    borderColor: '#f3a3a3',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  typeTagActive: {
    backgroundColor: '#fcdada',
    borderColor: '#f28c8c',
  },
  typeText: {
    fontSize: 13,
    color: '#d66a6a',
  },
  typeTextActive: {
    fontWeight: '700',
    color: '#d66a6a',
  },
  submitBtn: {
    backgroundColor: '#e78282',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitBtnDisabled: {
    backgroundColor: '#ccc',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomPadding: {
    height: 20,
  },
});

export default ReviewWriteScreen;
