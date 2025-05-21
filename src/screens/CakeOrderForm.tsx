import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TopBar from "../components/TopBar";
import OrderFormInput from "../components/OrderFormInput";
import FormFieldWithDropdown from "../components/FormFieldWithDropdown";
import OrderButton from "../components/OrderButton";
import CalendarIcon from "../../assets/icons/calendar-icon.svg";
import ClockIcon from "../../assets/icons/clock-icon.svg";
import UploadButton from "../components/UploadButton";
import CakeTypeSelection from "../components/CakeTypeSelection";
import ImageUpload from "../components/ImageUpload";
import OrderFlowModal from "../components/OrderFlowModal"; //  주문 모달 import 추가

const CakeOrderForm = () => {
  const [images, setImages] = useState<string[]>([]);
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

  const [modalVisible, setModalVisible] = useState(false); // ✅ 모달 표시 여부
  const [modalType, setModalType] = useState<'requested' | 'approved' | 'success'>('requested'); // ✅ 모달 종류

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

          <View style={styles.dropdownSpacing}>
            <FormFieldWithDropdown
              label="케이크 타입"
              placeholder="케이크 타입 선택"
              value={formData.type}
              options={["레터링", "과일", "유아용", "떡", "포토", "이벤트"]}
              visible={dropdownVisible.type}
              onPress={() => toggleDropdown("type")}
              onSelect={(value) => {
                setFormData({ ...formData, type: value });
                setDropdownVisible({ ...dropdownVisible, type: false });
              }}
            />
          </View>

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
            <ImageUpload
              images={images}
              onAddImage={(uri: string) => setImages([...images, uri])}
            />
            <View style={styles.thumbnailContainer}>
              {images.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.thumbnail} />
              ))}
            </View>
          </View>
        </View>

        {/* ✅ 주문 버튼 누르면 모달 표시 */}
        <OrderButton
          onCancel={() => {}}
          onOrder={() => {
            setModalType('requested');
            setModalVisible(true);
          }}
        />
      </ScrollView>

      {/* ✅ 모달 렌더링 */}
      <OrderFlowModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalType}
        cakeName={formData.type + " 케이크"}
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
});

export default CakeOrderForm;