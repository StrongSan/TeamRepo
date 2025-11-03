import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatDateLabelProps {
  date: string;
}

const ChatDateLabel: React.FC<ChatDateLabelProps> = ({ date }) => {
  const d = new Date(date);
  const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;

  return (
    <View style={styles.dateWrap}>
      <Text style={styles.dateText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dateWrap: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});

export default ChatDateLabel;
