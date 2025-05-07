import * as React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView, 
  Platform,   
  Alert           
} from "react-native";
import TopBar from "../components/TopBar";
import InputField from "../components/OrderFormInput";
import ImageUpload from "../components/ImageUpload";
import CakeTypeSelection from "../components/CakeTypeSelection";
import SubmitButton from "../components/PrimaryButton";
import FormFieldWithDropdown from "../components/FormFieldWithDropdown";
import { submitPostForm } from '../api/postAPI';
import { launchImageLibrary } from 'react-native-image-picker';

const SellerWriting: React.FC = () => {

  const [formData, setFormData] = React.useState({
    type: "",
    size: "",
    sheet: "",
    filling: "",
  });

  const [dropdownVisible, setDropdownVisible] = React.useState({
    type: false,
    size: false,
    sheet: false,
    filling: false,
  });

  const toggleDropdown = (field: keyof typeof dropdownVisible) => {
    setDropdownVisible({
      type: false,
      size: false,
      sheet: false,
      filling: false,
      [field]: !dropdownVisible[field],
    });
  };  
  
  
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [selectedCakeTypes, setSelectedCakeTypes] = React.useState<string[]>([]);
  const [images, setImages] = React.useState<string[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<any>(null);
  const handlePickImage = async () => {
  const result = await launchImageLibrary({ mediaType: 'photo' });
  
    if (result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      setSelectedImage(image);
    
      if (image.uri) {
        setImages([...images, image.uri]);
      }
    }
  };
  const handleCakeTypeToggle = (cakeType: string) => {
    if (selectedCakeTypes.includes(cakeType)) {
      setSelectedCakeTypes(
        selectedCakeTypes.filter((type) => type !== cakeType),
      );
    } else {
      setSelectedCakeTypes([...selectedCakeTypes, cakeType]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || selectedCakeTypes.length === 0 || !selectedImage) {
      Alert.alert('모든 항목을 입력해주세요.');
      return;
    }
  
    try {
      await submitPostForm({
        title,
        description,
        price,
        cakeTypes: selectedCakeTypes,
        image: {
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: selectedImage.fileName || 'image.jpg',
        },
      });
  
      Alert.alert('작성 완료', '케이크 글이 등록되었습니다.');
    } catch (e) {
      Alert.alert('업로드 실패', '잠시 후 다시 시도해주세요.');
      console.error(e);
    }
  };
  

  return (
    <>
      <TopBar title="글 작성" />
      {/* 키보드 올라올 때 입력창 안 가리게 */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer} // 스크롤 내용 전체 영역을 채우도록 변경
        >
          <View style={styles.content}>
          <InputField label="제목" placeholder="제목을 입력해 주세요." />

          <InputField
              label="케이크 설명"
              placeholder="케이크 설명을 작성해 주세요."
              multiline
              height={120}
            />

            <InputField
              label="케이크 가격"
              placeholder="케이크 가격을 입력해 주세요."
              keyboardType="numeric"
            />

            <View style={styles.dropdownSpacing}>
            <FormFieldWithDropdown
              label="케이크 타입"
              placeholder="케이크 타입 선택"
              value={formData.type}
              options={["레터링", "과일", "유아용", "떡", "포토", "이벤트트"]}
              visible={dropdownVisible.type}
              onPress={() => toggleDropdown("type")}
              onSelect={(value) => {
                setFormData({ ...formData, type: value });
                setDropdownVisible({ ...dropdownVisible, type: false });
              }}
            />
          </View>
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
          <ImageUpload
              images={images}
              onAddImage={(uri: string) => setImages([...images, uri])}
            />
            <View style={styles.thumbnailContainer}>
              {images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.thumbnail}
                />
              ))}
            </View>
            {/*
            <CakeTypeSelection
              selectedTypes={selectedCakeTypes}
              onToggleType={handleCakeTypeToggle}
            />
            /*}

            {/* 스크롤 안에 작성 버튼 포함시키고 정렬 */}
            <SubmitButton
              title="작성하기"
              onPress={handleSubmit}
              style={{
                marginBottom: 40, // 하단 공간 확보
                height: 48,
                width: "100%",
                borderRadius: 10,
                backgroundColor: "#E78182",
                alignSelf: "center", // 가운데 정렬
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, 
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 20,
  },
  content: {
    width: "90%",
    maxWidth: 360,
  },
  descriptionInput: {
    minHeight: 224,
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
  dropdownSpacing: {
    marginBottom: 25,
    paddingHorizontal: 0,
  },
});

export default SellerWriting;
