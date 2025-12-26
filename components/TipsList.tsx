import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface TipsListProps {
  title?: string;
  tips: string[];
  icon?: string;
}

export function TipsList({ title, tips, icon = '💡' }: TipsListProps) {
  return (
    <ThemedView style={styles.container}>
      {title && (
        <View style={styles.header}>
          <ThemedText style={styles.icon}>{icon}</ThemedText>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>
      )}
      
      <View style={styles.tipsContainer}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipRow}>
            <View style={styles.bullet}>
              <View style={styles.bulletDot} />
            </View>
            <ThemedText style={styles.tipText}>
              {tip.replace(/\*\*/g, '')}
            </ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(149, 225, 211, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#95E1D3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#95E1D3',
  },
  tipsContainer: {
    gap: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    marginTop: 6,
    width: 20,
    alignItems: 'center',
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#95E1D3',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
