import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image
} from "react-native";
import { useState } from "react";
import TopBar from "../components/TopBar";
import OrderFormInput from "../components/OrderFormInput";
import FormFieldWithDropdown from "../components/FormFieldWithDropdown";
import OrderButton from "../components/OrderButton";
import CalendarIcon from "../../assets/icons/calendar-icon.svg";
import ClockIcon from "../../assets/icons/clock-icon.svg";
import UploadButton from "../components/UploadButton";
import CakeTypeSelection from "../components/CakeTypeSelection";
import ImageUpload from "../components/ImageUpload";

const CakeOrderForm = () => {
  const [images, setImages] = React.useState<string[]>([]); // 이미지 상태태
  const [formData, setFormData] = React.useState({
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

  const [selectedCakeTypes, setSelectedCakeTypes] = React.useState<string[]>([]);

  const toggleCakeType = (type: string) => {
    setSelectedCakeTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [type] // 단일 선택
    );
  };

  const [dropdownVisible, setDropdownVisible] = useState({
    size: false,
    sheet: false,
    shape: false,
    filling: false,
    type: false,
  });

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
  

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TopBar title="케이크 주문하기" onBackPress={() => {}}
          style={{paddingBottom: 20}} />

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <OrderFormInput label="이름" placeholder="픽업자 이름 입력" />
          <OrderFormInput label="픽업 날짜" placeholder="픽업 날짜 선택" rightIcon={<CalendarIcon />} />
          <OrderFormInput label="픽업 시간" placeholder="픽업 시간 선택" rightIcon={<ClockIcon />} />
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
          <OrderFormInput label="레터링 문구" placeholder="레터링 문구(1 ~ 10글자 입력)" />

          <View style={styles.dropdownSpacing}>
          <FormFieldWithDropdown
              label="사이즈"
              placeholder="케이크 사이즈 선택"
              value={formData.size}
              options={["도시락", "미니", "1호", "2호", "3호"]}
              visible={dropdownVisible.size}
              onPress={() => toggleDropdown("size")}
              onSelect={(value) => {
                setFormData({ ...formData, size: value });
                setDropdownVisible({ ...dropdownVisible, size: false });
              }}
            />
          </View>
          <View style={styles.dropdownSpacing}>
          <FormFieldWithDropdown
              label="모양"
              placeholder="케이크 모양 선택"
              value={formData.shape}
              options={["원형", "하트", "사각형"]}
              visible={dropdownVisible.shape}
              onPress={() => toggleDropdown("shape")}
              onSelect={(value) => {
                setFormData({ ...formData, shape: value });
                setDropdownVisible({ ...dropdownVisible, shape: false });
              }}
            />
           </View>
          <View style={styles.dropdownSpacing}>
          <FormFieldWithDropdown
              label="시트"
              placeholder="케이크 시트 선택"
              value={formData.sheet}
              options={["초코", "바닐라"]}
              visible={dropdownVisible.sheet}
              onPress={() => toggleDropdown("sheet")}
              onSelect={(value) => {
                setFormData({ ...formData, sheet: value });
                setDropdownVisible({ ...dropdownVisible, sheet: false });
              }}
            />
          </View>
          <View style={styles.dropdownSpacing}>
          <FormFieldWithDropdown
              label="필링"
              placeholder="케이크 필링 선택"
              value={formData.filling}
              options={["초코", "오레오", "생크림", "딸기생크림", "크림치즈"]}
              visible={dropdownVisible.filling}
              onPress={() => toggleDropdown("filling")}
              onSelect={(value) => {
                setFormData({ ...formData, filling: value });
                setDropdownVisible({ ...dropdownVisible, filling: false });
              }}
            />
          </View>

          <OrderFormInput label="기타 전달사항" placeholder="사장님께 전달할 내용 입력" multiline height={90} />

          <View style={styles.uploadSection}>
            <Text style={styles.label}>참고 디자인</Text>
            {/* 👇 여기서 UploadButton 대신 ImageUpload 사용 */}
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

          {/* /ui 더러움 문제로 잠시 폐기
           <CakeTypeSelection
            selectedTypes={selectedCakeTypes}
            onToggleType={toggleCakeType}
          /> */}
        </View>

        <OrderButton onCancel={() => {}} onOrder={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    paddingHorizontal: 20,
    paddingBottom: 10,
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
