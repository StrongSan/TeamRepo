import * as React from "react";
import { View, StyleSheet, ScrollView, Image, StatusBar } from "react-native";
import TopBar from "../components/TopBar";
import InputField from "../components/UploadInputField";
import ImageUpload from "../components/ImageUpload";
import CakeTypeSelection from "../components/CakeTypeSelection";
import SubmitButton from "../components/PrimaryButton";

const SellerWriting: React.FC = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [selectedCakeTypes, setSelectedCakeTypes] = React.useState<string[]>(
    [],
  );
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
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollView}>
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
        </View>
      </ScrollView>
      <SubmitButton
        title="작성하기"
        onPress={handleSubmit}
        style={{
          marginHorizontal: 20,
          height: 48,
          width: "90%",
          borderRadius: 10,
          backgroundColor: "#E78182",
        }}
      />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 480,
    width: "100%",
    paddingBottom: 26,
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
  },
  content: {
    marginTop: 34,
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
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
  }
});

export default SellerWriting;
