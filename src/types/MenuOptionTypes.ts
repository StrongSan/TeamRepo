import { SvgProps } from 'react-native-svg';
import { FC, ReactNode } from 'react';

export interface MenuOptionProps {
  icon: string | FC<SvgProps>;
  title: string;
  rightIcon?: string | FC<SvgProps>;
  onPress?: () => void;
  customStyles?: any;
  textColor?: string;
  iconProps?: SvgProps; // 아이콘에 추가 스타일 전달용
}