import React, { useState } from "react";
import {
  ScrollView, View, StyleSheet, Text, SafeAreaView, Image, TouchableOpacity,
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

import { launchImageLibrary } from "react-native-image-picker";
import UploadIcon from "../../assets/icons/upload-icon.svg";
import PlusIcon from "../../assets/icons/bottom-plus.svg";

/* 사용 안하는 임포트 
import UploadButton from "../components/UploadButton";
import CakeTypeSelection from "../components/CakeTypeSelection";
import ImageUpload from "../components/ImageUpload";
*/

type CakeOrderFormRouteProp = RouteProp<RootStackParamList, "CakeOrderForm">;

const CakeOrderForm = () => {
  const route = useRoute<CakeOrderFormRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { postId } = route.params;

  const [images, setImages] = useState<string[]>([]);
  
  console.log("주문화면으로 전달된 postId:", postId);
  // 대표 이미지 (1장만 백엔드 보낼 경우)
  const [selectedImage, setSelectedImage] = React.useState<any>(null);

  // 이미지 선택 함수
  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri) {
        setImages((prev) => [...prev, uri]);
        setSelectedImage({
          uri,
          type: result.assets[0].type || "image/jpeg",
          fileName: result.assets[0].fileName || "image.jpg",
        });
      }
    }
  };

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


  return (
    <SafeAreaView style={styles.safeContainer}>
      <TopBar title="케이크 주문하기" onBackPress={() => {}} style={{ paddingBottom: 20 }} />

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

            {images.length === 0 ? (
              // 이미지 없을 때: 업로드 버튼만
              <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
                <View style={styles.uploadContent}>
                  <UploadIcon width={18} height={18} fill="#E78182" />
                  <Text style={styles.uploadText}>사진 업로드</Text>
                </View>
              </TouchableOpacity>
            ) : (
              // 이미지 있을 때: 썸네일 + 삭제(x) + +버튼
              <View style={styles.thumbnailContainer}>
                {images.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.thumbnail} />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        const newImages = [...images];
                        newImages.splice(index, 1);
                        setImages(newImages);
                      }}
                    >
                      <Text style={styles.deleteText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity onPress={handlePickImage}>
                  <View style={styles.addButton}>
                    <PlusIcon width={24} height={24} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>


        {/* ✅ 주문 버튼 누르면 모달 표시 */}
        <OrderButton
          onCancel={() => {}}
          onOrder={() => {
            setModalType('requested');
            setModalVisible(true);
          }}
        />
        </View>
      </ScrollView>

      {/* ✅ 모달 렌더링 */}
      <OrderFlowModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalType}
        cakeName={formData.type + " 케이크"}
        onNext={() => {
        setModalVisible(false);
        navigation.navigate("Payment", { postId });
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
  thumbnailContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 12,
  marginBottom: 12,
},
thumbnail: {
  width: 80,
  height: 80,
  borderRadius: 8,
},
addButton: {
  width: 80,
  height: 80,
  borderRadius: 8,
  backgroundColor: "#d9d9d9",
  justifyContent: "center",
  alignItems: "center",
},
uploadButton: {
  backgroundColor: "#ffffff",
  borderColor: "#E78182",
  borderWidth: 1,
  height: 48,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 10,
  marginTop: 12,
  marginBottom: 8,
},
uploadText: {
  color: "#E78182",
  fontSize: 16,
  fontWeight: "500",
  marginLeft: 6,
},
uploadContent: {
  flexDirection: "row",
  alignItems: "center",
},
imageWrapper: {
  position: "relative",
},
deleteButton: {
  position: "absolute",
  top: -6,
  right: -6,
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: "#000",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1,
},
deleteText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "bold",
},

});

export default CakeOrderForm;