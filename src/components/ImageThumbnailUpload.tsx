import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import UploadIcon from '../../assets/icons/upload-icon.svg';
import PlusIcon from '../../assets/icons/bottom-plus.svg';

interface ImageThumbnailUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onImageSelect?: (image: { uri: string; type: string; fileName: string }) => void;
  maxImages?: number;
  uploadButtonText?: string;
  showAddButton?: boolean;
}

const ImageThumbnailUpload: React.FC<ImageThumbnailUploadProps> = ({
  images,
  onImagesChange,
  onImageSelect,
  maxImages = 5,
  uploadButtonText = '사진 업로드',
  showAddButton = true,
}) => {
  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri) {
        const newImages = [...images, uri];
        onImagesChange(newImages);
        
        if (onImageSelect) {
          onImageSelect({
            uri,
            type: result.assets[0].type || 'image/jpeg',
            fileName: result.assets[0].fileName || 'image.jpg',
          });
        }
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  if (images.length === 0) {
    return (
      <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
        <View style={styles.uploadContent}>
          <UploadIcon width={18} height={18} fill="#E78182" />
          <Text style={styles.uploadText}>{uploadButtonText}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.thumbnailContainer}>
      {images.map((uri, index) => (
        <View key={index} style={styles.imageWrapper}>
          <Image source={{ uri }} style={styles.thumbnail} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleRemoveImage(index)}
          >
            <Text style={styles.deleteText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
      {showAddButton && images.length < maxImages && (
        <TouchableOpacity onPress={handlePickImage}>
          <View style={styles.addButton}>
            <PlusIcon width={24} height={24} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    backgroundColor: '#ffffff',
    borderColor: '#E78182',
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    color: '#E78182',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageThumbnailUpload;
