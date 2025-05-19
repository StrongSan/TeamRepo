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
import { SafeAreaView } from "react-native-safe-area-context";

import TopBar from "../components/TopBar";
import InputField from "../components/OrderFormInput";
import ImageUpload from "../components/ImageUpload";
import SubmitButton from "../components/PrimaryButton";
import FormFieldWithDropdown from "../components/FormFieldWithDropdown";
import { submitPostForm } from "../api/postAPI";
import { launchImageLibrary } from "react-native-image-picker";

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
  const [images, setImages] = React.useState<string[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<any>(null);

  const handleSubmit = async () => {
    const { type, size, sheet, filling } = formData;

    if (!title || !description || !price || !type || !size || !sheet || !filling || !selectedImage) {
      Alert.alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      await submitPostForm({
        title,
        description,
        price,
        cakeTypes: [type, size, sheet, filling],
        image: {
          uri: selectedImage.uri,
          type: selectedImage.type || "image/jpeg",
          name: selectedImage.fileName || "image.jpg",
        },
      });

      Alert.alert("글이 등록되었습니다.");
    } catch (e) {
      Alert.alert("등록 실패", "잠시 후 다시 시도해주세요.");
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBar title="글 작성" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <InputField
              label="제목"
              placeholder="제목을 입력해 주세요."
              value={title}
              onChangeText={setTitle}
            />
            <InputField
              label="케이크 설명"
              placeholder="케이크 설명을 작성해 주세요."
              multiline
              height={120}
              value={description}
              onChangeText={setDescription}
            />
            <InputField
              label="케이크 가격"
              placeholder="케이크 가격을 입력해 주세요."
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
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
              onAddImage={(uri: string) => {
                setImages([...images, uri]);
                setSelectedImage({
                  uri,
                  type: "image/jpeg",
                  fileName: "image.jpg",
                });
              }}
            />
            <View style={styles.thumbnailContainer}>
              {images.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.thumbnail} />
              ))}
            </View>
            <SubmitButton
              title="작성하기"
              onPress={handleSubmit}
              style={{
                marginBottom: 40,
                height: 48,
                width: "100%",
                borderRadius: 10,
                backgroundColor: "#E78182",
                alignSelf: "center",
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  },
});

export default SellerWriting;
