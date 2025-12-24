import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';

interface QuickActionButtonProps {
  text: string;
  onPress: () => void;
}

export function QuickActionButton({ text, onPress }: QuickActionButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <ThemedText style={styles.text}>{text}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
