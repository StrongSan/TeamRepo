// ImageUpload.tsx
import React from "react";
import { launchImageLibrary } from "react-native-image-picker";
import TestButton from "./UploadButton"; // ✅ UploadButton 대신 TestButton 사용

interface ImageUploadProps {
  images: string[];
  onAddImage: (uri: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onAddImage }) => {
  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri) {
        onAddImage(uri);
      }
    }
  };

  return <TestButton onPress={handlePickImage} />;
};

export default ImageUpload;
