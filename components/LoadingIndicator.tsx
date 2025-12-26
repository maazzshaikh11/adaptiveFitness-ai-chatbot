import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

export function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <ActivityIndicator size="small" />
        <ThemedText style={styles.text}>Thinking...</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8, paddingHorizontal: 16, alignItems: 'flex-start' },
  bubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f3f5', padding: 12, borderRadius: 14, gap: 8 },
  text: { fontSize: 14, opacity: 0.7 },
});
