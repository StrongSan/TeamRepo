import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import TopBar from "../components/TopBar";
import OrderFormInput from "../components/OrderFormInput";
import FormFieldWithDropdown from "../components/FormFieldWithDropdown";
import OrderButton from "../components/OrderButton";
import CalendarIcon from "../../assets/icons/calendar-icon.svg";
import ClockIcon from "../../assets/icons/clock-icon.svg";
import UploadButton from "../components/UploadButton";
import CakeTypeSelection from "../components/CakeTypeSelection";

const CakeOrderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    pickupDate: "",
    pickupTime: "",
    letteringText: "",
    size: "",
    shape: "",
    taste: "",
    notes: "",
  });

  const [selectedCakeTypes, setSelectedCakeTypes] = useState<string[]>([]);

  const toggleCakeType = (type: string) => {
    setSelectedCakeTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TopBar title="케이크 주문하기" onBackPress={() => {}} />

      <View style={styles.content}>
        <OrderFormInput
          label="이름"
          placeholder="픽업자 이름 입력"
        />
        <OrderFormInput
          label="픽업 날짜"
          placeholder="픽업 날짜 선택"
          rightIcon={<CalendarIcon />}
        />
        <OrderFormInput
          label="픽업 시간"
          placeholder="픽업 시간 선택"
          rightIcon={<ClockIcon />}
        />
        <OrderFormInput
          label="레터링 문구"
          placeholder="레터링 문구(1 ~ 10글자 입력)"
        />

        <View style={styles.dropdownSpacing}>
          <FormFieldWithDropdown
            label="사이즈"
            placeholder="케이크 사이즈 선택"
            value={formData.size}
            onPress={() => {}}
          />
        </View>
        <View style={styles.dropdownSpacing}>
          <FormFieldWithDropdown
            label="모양"
            placeholder="케이크 모양 선택"
            value={formData.shape}
            onPress={() => {}}
          />
        </View>
        <View style={styles.dropdownSpacing}>
          <FormFieldWithDropdown
            label="시트/맛"
            placeholder="케이크 시트/맛 선택"
            value={formData.taste}
            onPress={() => {}}
          />
        </View>

        <OrderFormInput
          label="기타 전달사항"
          placeholder="사장님께 전달할 내용 입력"
          multiline
          height={90}
        />

        <View style={styles.uploadSection}>
          <Text style={styles.label}>참고 디자인</Text>
          <UploadButton onPress={() => {}} />
        </View>

        <CakeTypeSelection
          selectedTypes={selectedCakeTypes}
          onToggleType={toggleCakeType}
        />
      </View>

      <OrderButton onCancel={() => {}} onOrder={() => {}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 25,
    paddingHorizontal: 12,
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
