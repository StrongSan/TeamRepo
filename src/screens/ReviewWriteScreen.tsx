import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Icon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { createReview, updateReview, ReviewCreateRequest, ReviewUpdateRequest, ReviewResponse } from '../api/reviewAPI';
import { getOrderDetail, OrderDetailResponse } from '../api/orderAPI';
import { fetchPostById } from '../api/postAPI';
import { BASE_URL } from '../api/config';
import StarRatingInput from '../components/StarRatingInput';
import ImageThumbnailUpload from '../components/ImageThumbnailUpload';
import CakeTypeSelector from '../components/CakeTypeSelector';
import OrderPreviewCard from '../components/OrderPreviewCard';

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
  const { orderId, userId, isEdit, existingReview } = route.params;
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderInfo, setOrderInfo] = useState<OrderDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 수정 모드인 경우 기존 리뷰 데이터 로드
    if (isEdit && existingReview) {
      setRating(existingReview.rating);
      // 기존 리뷰 내용을 제목과 내용으로 분리
      const commentParts = existingReview.comment.split('\n\n');
      if (commentParts.length >= 2) {
        setTitle(commentParts[0]);
        setContent(commentParts[1]);
        // 케이크 종류 추출
        const cakeTypePart = commentParts[2];
        if (cakeTypePart && cakeTypePart.includes('케이크 종류:')) {
          const types = cakeTypePart.replace('케이크 종류: ', '').split(', ');
          setSelectedTypes(types.filter((type: string) => type.trim() !== ''));
        }
      } else {
        setContent(existingReview.comment);
      }
    }
    
    // 주문 정보 가져오기
    loadOrderInfo();
  }, [isEdit, existingReview]);

  const loadOrderInfo = async () => {
    try {
      setIsLoading(true);
      
      if (isEdit && existingReview) {
        // 수정 모드: 기존 리뷰의 케이크 정보 가져오기
        try {
          const cakePost = await fetchPostById(existingReview.cakeId);
          const orderData: OrderDetailResponse = {
            id: 'edit-mode',
            thumbnail: cakePost.imageUrl || '',
            title: cakePost.title || '',
            pickupDate: new Date().toISOString().split('T')[0],
            options: '1단 케이크 x1',
            price: parseInt(cakePost.price) || 0,
            status: 'COMPLETED' as const,
            orderDate: new Date(existingReview.createdAt).toISOString().split('T')[0],
            customerInfo: {
              name: '',
              phone: ''
            },
            cakeInfo: {
              postId: cakePost.postId,
              title: cakePost.title,
              imageUrl: cakePost.imageUrl,
              description: cakePost.description
            },
            orderOptions: {
              variantId: cakePost.variantId,
              sheetId: cakePost.sheetId || 1,
              fillingId: cakePost.fillingId || 1,
              sizeId: cakePost.sizeId || 1,
              typeId: cakePost.typeId || 1
            }
          };
          setOrderInfo(orderData);
        } catch (error) {
          console.error('케이크 정보 로드 실패:', error);
          // API 실패 시 최소한의 정보만 표시
          const fallbackData: OrderDetailResponse = {
            id: 'edit-mode',
            thumbnail: '',
            title: '',
            pickupDate: new Date().toISOString().split('T')[0],
            options: '',
            price: 0,
            status: 'COMPLETED' as const,
            orderDate: new Date(existingReview.createdAt).toISOString().split('T')[0],
            customerInfo: {
              name: '',
              phone: ''
            },
            cakeInfo: {
              postId: existingReview.cakeId,
              title: '',
              imageUrl: '',
              description: ''
            },
            orderOptions: {
              variantId: existingReview.cakeId,
              sheetId: 1,
              fillingId: 1,
              sizeId: 1,
              typeId: 1
            }
          };
          setOrderInfo(fallbackData);
        }
        return;
      }
      
      // 새 리뷰 작성 모드
      try {
        const orderData = await getOrderDetail(orderId);
        console.log('리뷰 화면 주문 상세 데이터:', JSON.stringify(orderData, null, 2));
        setOrderInfo(orderData);
      } catch (apiError) {
        // API 호출 실패 시 오류 메시지 표시 (fallback 제거)
        console.error('주문 상세 정보 API 호출 실패:', apiError);
        Alert.alert(
          '오류',
          '주문 정보를 불러올 수 없습니다. 다시 시도해주세요.',
          [
            {
              text: '확인',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
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
      if (isEdit && existingReview) {
        // 리뷰 수정
        const updateData: ReviewUpdateRequest = {
          userId: parseInt(userId),
          rating: rating,
          comment: `${title}\n\n${content}\n\n케이크 종류: ${selectedTypes.join(', ')}`,
        };

        console.log('리뷰 수정 데이터:', JSON.stringify(updateData, null, 2));
        console.log('API 호출 시작: PATCH /api/reviews/' + existingReview.reviewId);

        try {
          await updateReview(existingReview.reviewId, updateData);
          console.log('리뷰 수정 성공');
          
          Alert.alert(
            '성공',
            '리뷰가 성공적으로 수정되었습니다.',
            [
              {
                text: '확인',
                onPress: () => {
                  // MyReviews 화면으로 돌아가기
                  navigation.navigate('MyReviews', { userId });
                },
              },
            ]
          );
        } catch (apiError: any) {
          console.error('리뷰 수정 API 호출 실패:', apiError);
          const errorMessage = apiError.response?.data?.message || apiError.message || '리뷰 수정 중 오류가 발생했습니다.';
          Alert.alert('오류', errorMessage);
        }
      } else {
        // 리뷰 생성
        const reviewData: ReviewCreateRequest = {
          userId: parseInt(userId),
          cakeId: orderInfo.cakeInfo.postId,
          rating: rating,
          comment: `${title}\n\n${content}\n\n케이크 종류: ${selectedTypes.join(', ')}`,
        };

        console.log('리뷰 작성 데이터:', JSON.stringify(reviewData, null, 2));
        console.log('userId:', userId, 'parsed:', parseInt(userId));
        console.log('cakeId:', orderInfo.cakeInfo.postId);
        console.log('API 호출 시작: POST /api/reviews');

        try {
          const result = await createReview(reviewData);
          console.log('리뷰 작성 성공:', result);
          
          Alert.alert(
            '성공',
            '리뷰가 성공적으로 등록되었습니다.',
            [
              {
                text: '확인',
                onPress: () => {
                  // MyReservations 화면으로 돌아가서 지난 주문 탭으로 이동
                  navigation.navigate('MyReservations', { 
                    userId, 
                    userType: 'customer',
                    initialTab: 'COMPLETED' // 지난 주문 탭으로 이동
                  });
                },
              },
            ]
          );
        } catch (apiError: any) {
          console.error('리뷰 작성 API 호출 실패:', apiError);
          
          // 실제 오류 메시지 표시
          const errorMessage = apiError.response?.data?.message || apiError.message || '리뷰 작성 중 오류가 발생했습니다.';
          Alert.alert('오류', errorMessage);
        }
      }
    } catch (error) {
      console.error('리뷰 처리 오류:', error);
      Alert.alert('오류', '리뷰 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };




  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEdit ? '리뷰 수정' : '리뷰 작성'}</Text>
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
          <Text style={styles.headerTitle}>{isEdit ? '리뷰 수정' : '리뷰 작성'}</Text>
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
        <OrderPreviewCard orderInfo={orderInfo} orderId={orderId} />

        {/* 별점 */}
        <StarRatingInput rating={rating} onRatingChange={setRating} />

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
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>사진 첨부 (선택)</Text>
          <Text style={styles.imageSubtitle}>최대 5장까지 업로드 가능</Text>
          <ImageThumbnailUpload
            images={images}
            onImagesChange={setImages}
            maxImages={5}
            uploadButtonText="사진 추가"
            showAddButton={true}
          />
        </View>

        {/* 케이크 종류 */}
        <CakeTypeSelector
          types={cakeTypes}
          selectedTypes={selectedTypes}
          onToggleType={toggleType}
        />

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
            <Text style={styles.submitText}>{isEdit ? '리뷰 수정' : '리뷰 등록'}</Text>
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
