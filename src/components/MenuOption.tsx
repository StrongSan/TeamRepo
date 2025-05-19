import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MenuOptionProps } from '../types/MenuOptionTypes';



const MenuOption: React.FC<MenuOptionProps> = ({
  icon,
  title,
  rightIcon,
  onPress,
  customStyles,
  textColor = '#363a33',
  iconProps
}) => {
  const IconComponent = icon;         // SVG 컴포넌트를 JSX에서 사용하려고 대문자 변수로 저장
  const RightIconComponent = rightIcon; // 마찬가지로 오른쪽 아이콘도 준비

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, customStyles]}>
        {/* icon이 string이면 이미지, 아니면 JSX로 렌더링 */}
        {typeof icon === 'string' ? (
          <Image source={{ uri: icon }} style={styles.icon} />
        ) : (
          IconComponent && <IconComponent width={24} height={24} {...iconProps} />
        )}

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </View>

        {/* rightIcon도 string이면 이미지, 아니면 JSX로 렌더링 */}
        {rightIcon &&
          (typeof rightIcon === 'string' ? (
            <Image source={{ uri: rightIcon }} style={styles.rightIcon} />
          ) : (
            RightIconComponent && <RightIconComponent width={24} height={24} />
          ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    display: 'flex',
    minHeight: 48,
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 26,
  },
  rightIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default MenuOption;
