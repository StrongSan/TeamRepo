import * as React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView, 
  Platform,              
} from "react-native";
import TopBar from "../components/TopBar";
import InputField from "../components/UploadInputField";
import ImageUpload from "../components/ImageUpload";
import CakeTypeSelection from "../components/CakeTypeSelection";
import SubmitButton from "../components/PrimaryButton";

const SellerWriting: React.FC = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [selectedCakeTypes, setSelectedCakeTypes] = React.useState<string[]>([]);
  const [images, setImages] = React.useState<string[]>([]);

  const handleCakeTypeToggle = (cakeType: string) => {
    if (selectedCakeTypes.includes(cakeType)) {
      setSelectedCakeTypes(
        selectedCakeTypes.filter((type) => type !== cakeType),
      );
    } else {
      setSelectedCakeTypes([...selectedCakeTypes, cakeType]);
    }
  };

  const handleSubmit = () => {
    console.log({
      title,
      description,
      price,
      selectedCakeTypes,
      images,
    });
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
            <InputField
              placeholder="제목"
              value={title}
              onChangeText={setTitle}
            />
            <InputField
              placeholder="케이크 설명을 작성해 주세요."
              value={description}
              onChangeText={setDescription}
              multiline
              style={styles.descriptionInput}
            />
            <InputField
              placeholder="케이크 가격 입력"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
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
            <CakeTypeSelection
              selectedTypes={selectedCakeTypes}
              onToggleType={handleCakeTypeToggle}
            />

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
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});

export default SellerWriting;
