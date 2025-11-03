import React, { useState } from "react";
import {
  ScrollView, View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TopBar from "../components/TopBar";
import OrderFormInput from "../components/OrderFormInput";
import FormFieldWithDropdown from "../components/FormFieldWithDropdown";
import OrderButton from "../components/OrderButton";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CalendarIcon from "../../assets/icons/calendar-icon.svg";
import ClockIcon from "../../assets/icons/clock-icon.svg";
import OrderFlowModal from "../components/OrderFlowModal"; //  주문 모달
import ImageThumbnailUpload from "../components/ImageThumbnailUpload";
import { createOrder, OrderRequestDto } from "../api/orderAPI";

/* 사용 안하는 임포트 
import UploadButton from "../components/UploadButton";
import CakeTypeSelection from "../components/CakeTypeSelection";
import ImageUpload from "../components/ImageUpload";
*/

type CakeOrderFormRouteProp = RouteProp<RootStackParamList, "CakeOrderForm">;

const CakeOrderForm = () => {
  const route = useRoute<CakeOrderFormRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { postId, userId, userType, price } = route.params;

  const [images, setImages] = useState<string[]>([]);
  
  console.log("주문화면으로 전달된 postId:", postId);
  // 대표 이미지 (1장만 백엔드 보낼 경우)
  const [selectedImage, setSelectedImage] = React.useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    pickupDate: "",
    pickupTime: "",
    letteringText: "",
    size: "",
    shape: "",
    notes: "",
    type: "",
    sheet: "",
    filling: "",
    price: price || "", // 전달받은 가격 정보 사용
  });

  const [selectedCakeTypes, setSelectedCakeTypes] = useState<string[]>([]);

  const toggleCakeType = (type: string) => {
    setSelectedCakeTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [type]
    );
  };

  const [dropdownVisible, setDropdownVisible] = useState({
    size: false,
    sheet: false,
    shape: false,
    filling: false,
    type: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부
  const [modalType, setModalType] = useState<'requested' | 'approved' | 'success'>('requested'); // 모달 종류
  const [isSubmitting, setIsSubmitting] = useState(false); // 주문 제출 중 상태

  const toggleDropdown = (field: keyof typeof dropdownVisible) => {
    setDropdownVisible((prev) => ({
      size: false,
      shape: false,
      sheet: false,
      filling: false,
      type: false,
      [field]: !prev[field],
    }));
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      setFormData({ ...formData, pickupDate: dateStr });
    }
  };

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      setFormData({ ...formData, pickupTime: `${hours}:${minutes}` });
    }
  };

  // 주문 생성 함수
  const handleCreateOrder = async () => {
    try {
      setIsSubmitting(true);
      
      // 폼 데이터를 OrderRequestDto 형식으로 변환
      const orderData: OrderRequestDto = {
        userId: parseInt(userId || '0'),
        postId: postId,
        name: formData.name,
        qty: 1, // 기본 수량
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        letteringText: formData.letteringText,
        memo: formData.notes,
        pickupName: formData.name,
        imageUrl: selectedImage?.uri || '',
        price: parseFloat(formData.price) || parseFloat(price || '0'),
        unitPrice: parseInt(formData.price) || parseInt(price || '0'),
        variantId: 1, // 기본값 (실제로는 옵션에 따라 결정)
        sheetId: formData.sheet === '초코' ? 1 : 2, // 시트 옵션 매핑
        fillingId: getFillingId(formData.filling), // 필링 옵션 매핑
        sizeId: getSizeId(formData.size), // 사이즈 옵션 매핑
        typeId: getTypeId(formData.type), // 타입 옵션 매핑
      };

      // 디버깅을 위한 데이터 로그
      console.log('전달받은 가격:', price);
      console.log('폼 데이터 가격:', formData.price);
      console.log('주문 데이터:', JSON.stringify(orderData, null, 2));
      
      // 필수 필드 검증
      if (!orderData.userId || orderData.userId === 0) {
        Alert.alert('오류', '사용자 ID가 올바르지 않습니다.');
        return;
      }
      
      if (!orderData.postId) {
        Alert.alert('오류', '상품 ID가 올바르지 않습니다.');
        return;
      }
      
      if (!orderData.name || !orderData.pickupDate || !orderData.pickupTime) {
        Alert.alert('오류', '필수 정보를 모두 입력해주세요.');
        return;
      }

      const response = await createOrder(orderData);
      console.log('주문 생성 성공:', response);
      
      // 성공 시 모달 표시
      setModalType('success');
      setModalVisible(true);
      
    } catch (error) {
      console.error('주문 생성 실패:', error);
      
      // 더 자세한 에러 정보 표시
      let errorMessage = '주문 생성에 실패했습니다.';
      if (error.response) {
        // 서버에서 응답을 받았지만 오류 상태
        console.error('서버 응답:', error.response.data);
        console.error('상태 코드:', error.response.status);
        errorMessage = `서버 오류 (${error.response.status}): ${error.response.data?.message || '알 수 없는 오류'}`;
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못함
        console.error('네트워크 오류:', error.request);
        errorMessage = '네트워크 연결을 확인해주세요.';
      } else {
        // 요청 설정 중 오류
        console.error('요청 설정 오류:', error.message);
        errorMessage = `요청 오류: ${error.message}`;
      }
      
      Alert.alert('오류', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 옵션 ID 매핑 함수들
  const getFillingId = (filling: string): number => {
    const fillingMap: { [key: string]: number } = {
      '초코': 1,
      '오레오': 2,
      '생크림': 3,
      '딸기생크림': 4,
      '크림치즈': 5,
    };
    return fillingMap[filling] || 1;
  };

  const getSizeId = (size: string): number => {
    const sizeMap: { [key: string]: number } = {
      '도시락': 1,
      '미니': 2,
      '1호': 3,
      '2호': 4,
      '3호': 5,
    };
    return sizeMap[size] || 1;
  };

  const getTypeId = (type: string): number => {
    const typeMap: { [key: string]: number } = {
      '레터링': 1,
      '과일': 2,
      '유아용': 3,
      '떡': 4,
      '포토': 5,
      '이벤트': 6,
    };
    return typeMap[type] || 1;
  };


  return (
    <SafeAreaView style={styles.safeContainer}>
      <TopBar title="케이크 주문하기" onBackPress={() => navigation.goBack()} style={{ paddingBottom: 20 }} />

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <OrderFormInput
            label="이름"
            placeholder="픽업자 이름 입력"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <OrderFormInput
            label="픽업 날짜"
            placeholder="날짜 선택"
            value={formData.pickupDate}
            onChangeText={() => {}}
            onPressRightIcon={() => setShowDatePicker(true)}
            rightIcon={<CalendarIcon />}
          />
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <OrderFormInput
            label="픽업 시간"
            placeholder="시간 선택"
            value={formData.pickupTime}
            onChangeText={() => {}}
            onPressRightIcon={() => setShowTimePicker(true)}
            rightIcon={<ClockIcon />}
          />
          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          {['type', 'size', 'sheet', 'filling'].map((field) => (
            <View style={styles.dropdownSpacing} key={field}>
              <FormFieldWithDropdown
                label={field === 'type' ? '케이크 타입' : field === 'size' ? '케이크 사이즈' : field === 'sheet' ? '시트' : '필링'}
                placeholder={field === 'type' ? '케이크 타입 선택' : field === 'size' ? '케이크 사이즈 선택' : field === 'sheet' ? '케이크 시트 선택' : '케이크 필링 선택'}
                value={formData[field as keyof typeof formData]}
                options={
                  field === 'type'
                    ? ['레터링', '과일', '유아용', '떡', '포토', '이벤트']
                    : field === 'size'
                    ? ['도시락', '미니', '1호', '2호', '3호']
                    : field === 'sheet'
                    ? ['초코', '바닐라']
                    : ['초코', '오레오', '생크림', '딸기생크림', '크림치즈']
                }
                visible={dropdownVisible[field as keyof typeof dropdownVisible]}
                onPress={() => toggleDropdown(field as keyof typeof dropdownVisible)}
                onSelect={(value) => {
                  setFormData({ ...formData, [field]: value });
                  setDropdownVisible({ ...dropdownVisible, [field]: false });
                }}
              />
            </View>
          ))}
          
          <OrderFormInput
            label="레터링 문구"
            placeholder="레터링 문구(1 ~ 10글자 입력)"
            value={formData.letteringText}
            onChangeText={(text) => setFormData({ ...formData, letteringText: text })}
          />

          {/* 기타 FormFieldWithDropdown 생략 */}

          <OrderFormInput
            label="기타 전달사항"
            placeholder="사장님께 전달할 내용 입력"
            multiline
            height={90}
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
          />

          <View style={styles.uploadSection}>
            <Text style={styles.label}>참고 디자인</Text>
            <ImageThumbnailUpload
              images={images}
              onImagesChange={(newImages) => {
                setImages(newImages);
                if (newImages.length > 0) {
                  const lastImage = newImages[newImages.length - 1];
                  setSelectedImage({
                    uri: lastImage,
                    type: "image/jpeg",
                    fileName: "image.jpg",
                  });
                }
              }}
              onImageSelect={(image) => {
                setSelectedImage(image);
              }}
              maxImages={5}
            />
          </View>


        {/* ✅ 주문 버튼 누르면 실제 주문 생성 */}
        <OrderButton
          onCancel={() => {}}
          onOrder={handleCreateOrder}
          disabled={isSubmitting}
        />
        </View>
      </ScrollView>

      {/* ✅ 모달 렌더링 */}
      <OrderFlowModal
        postId={postId}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalType}
        cakeName={`${formData.size || ""} ${formData.filling || ""} ${formData.type || ""} 케이크`.trim()}
        price={formData.price || "0"}
        orderDate={new Date().toISOString().split("T")[0]}
        onNext={() => {
          setModalVisible(false);
          // 주문 완료 후 내 주문내역으로 이동
          navigation.navigate("MyReservations", { userId: userId || '', userType: userType || 'customer' });
        }}
/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: 390,
    alignSelf: "center",
  },
  content: {
    paddingHorizontal: 15,
  },
  uploadSection: {
    marginBottom: 40,
  },
  label: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 6,
    fontFamily: "Roboto",
  },
  dropdownSpacing: {
    marginBottom: 25,
    paddingHorizontal: 0,
  },

});

export default CakeOrderForm;