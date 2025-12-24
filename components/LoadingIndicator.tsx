import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from './themed-text';

export function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <ActivityIndicator size="small" color="#4ECDC4" />
        <ThemedText style={styles.text}>Thinking...</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    gap: 8,
  },
  text: {
    fontSize: 14,
    opacity: 0.6,
  },
});
