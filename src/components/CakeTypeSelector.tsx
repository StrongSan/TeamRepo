import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CakeTypeSelectorProps {
  types: string[];
  selectedTypes: string[];
  onToggleType: (type: string) => void;
  label?: string;
}

const CakeTypeSelector: React.FC<CakeTypeSelectorProps> = ({
  types,
  selectedTypes,
  onToggleType,
  label = '케이크 종류 (선택)',
}) => {
  return (
    <View style={styles.typeSection}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={styles.typeWrap}>
        {types.map((type) => {
          const active = selectedTypes.includes(type);
          return (
            <TouchableOpacity
              key={type}
              style={[styles.typeTag, active && styles.typeTagActive]}
              onPress={() => onToggleType(type)}
            >
              <Text style={[styles.typeText, active && styles.typeTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  typeSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeTag: {
    borderWidth: 1,
    borderColor: '#f3a3a3',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  typeTagActive: {
    backgroundColor: '#fcdada',
    borderColor: '#f28c8c',
  },
  typeText: {
    fontSize: 13,
    color: '#d66a6a',
  },
  typeTextActive: {
    fontWeight: '700',
    color: '#d66a6a',
  },
});

export default CakeTypeSelector;
