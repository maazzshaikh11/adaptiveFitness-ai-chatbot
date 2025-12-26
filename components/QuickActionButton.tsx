import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';

interface QuickActionButtonProps { text: string; onPress: () => void }

export function QuickActionButton({ text, onPress }: QuickActionButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8} accessibilityRole="button">
      <View>
        <ThemedText style={styles.text}>{text}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: '#4ECDC4', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, marginRight: 10, marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  text: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
