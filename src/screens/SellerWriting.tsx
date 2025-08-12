import * as React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import PlusIcon from "../../assets/icons/bottom-plus.svg";
import UploadIcon from "../../assets/icons/upload-icon.svg";
import TopBar from "../components/TopBar";
import InputField from "../components/OrderFormInput";
import SubmitButton from "../components/PrimaryButton";
import FormFieldWithDropdown from "../components/FormFieldWithDropdown";
import { submitPostForm, resolveVariantId } from "../api/postAPI";

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
      ...dropdownVisible,
      [field]: !dropdownVisible[field],
    });
  };

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<any>(null);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: "photo", quality: 1 });
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

  const handleSubmit = async () => {
    const { type, size, sheet, filling } = formData;

    if (!title || !description || !price || !type || !size || !sheet || !filling || !selectedImage) {
      Alert.alert("모든 항목을 입력해주세요.");
      return;
    }

    const typeIdMap: Record<string, number> = {
      레터링: 1,
      과일: 2,
      유아용: 3,
      떡: 4,
      포토: 5,
      이벤트: 6,
    };
    const sizeIdMap: Record<string, number> = {
      도시락: 1,
      미니: 2,
      "1호": 3,
      "2호": 4,
      "3호": 5,
    };
    const sheetIdMap: Record<string, number> = {
      초코: 1,
      바닐라: 2,
    };
    const fillingIdMap: Record<string, number> = {
      초코: 1,
      오레오: 2,
      생크림: 3,
      딸기생크림: 4,
      크림치즈: 5,
    };

    const variant = await resolveVariantId(
      sheetIdMap[sheet],
      fillingIdMap[filling],
      sizeIdMap[size],
      typeIdMap[type]
    );

    if (!variant) {
      Alert.alert("케이크 조합이 유효하지 않습니다.");
      return;
    }

    try {
      await submitPostForm({
        title,
        description,
        price,
        variantId: variant,
        image: {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.fileName,
        },
      });
      Alert.alert("글이 등록되었습니다.");
    } catch (e) {
      Alert.alert("등록 실패", "잠시 후 다시 시도해주세요.");
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
      <TopBar title="글 작성" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={{ backgroundColor: "#fff" }} contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <InputField label="제목" placeholder="제목을 입력해 주세요." value={title} onChangeText={setTitle} />
            <InputField label="케이크 설명" placeholder="케이크 설명을 작성해 주세요." multiline height={120} value={description} onChangeText={setDescription} />
            <InputField label="케이크 가격" placeholder="케이크 가격을 입력해 주세요." keyboardType="numeric" value={price} onChangeText={setPrice} />

            {["type", "size", "sheet", "filling"].map((field) => (
              <View style={styles.dropdownSpacing} key={field}>
                <FormFieldWithDropdown
                  label={field === "type" ? "케이크 타입" : field === "size" ? "사이즈" : field === "sheet" ? "시트" : "필링"}
                  placeholder={
                    field === "type"
                      ? "케이크 타입 선택"
                      : field === "size"
                      ? "케이크 사이즈 선택"
                      : field === "sheet"
                      ? "케이크 시트 선택"
                      : "케이크 필링 선택"
                  }
                  value={formData[field as keyof typeof formData]}
                  options={
                    field === "type"
                      ? ["레터링", "과일", "유아용", "떡", "포토", "이벤트"]
                      : field === "size"
                      ? ["도시락", "미니", "1호", "2호", "3호"]
                      : field === "sheet"
                      ? ["초코", "바닐라"]
                      : ["초코", "오레오", "생크림", "딸기생크림", "크림치즈"]
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

            {images.length === 0 ? (
              <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
                <View style={styles.uploadContent}>
                  <UploadIcon width={18} height={18} fill="#E78182" />
                  <Text style={styles.uploadText}>사진 업로드</Text>
                </View>
              </TouchableOpacity>
            ) : (
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
  dropdownSpacing: {
    marginBottom: 25,
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

export default SellerWriting;
