import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { PersonalityOption } from '@/types';

interface PersonalityCardProps {
  personality: PersonalityOption;
  isSelected: boolean;
  onSelect: () => void;
}

export function PersonalityCard({ personality, isSelected, onSelect }: PersonalityCardProps) {
  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
      <ThemedView
        style={[
          styles.card,
          isSelected && styles.cardSelected,
          { borderColor: personality.color }
        ]}
      >
        <View style={styles.header}>
          <ThemedText style={styles.icon}>{personality.icon}</ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            {personality.title}
          </ThemedText>
        </View>
        
        <ThemedText style={styles.description}>
          {personality.description}
        </ThemedText>
        
        <View style={styles.traits}>
          {personality.traits.map((trait, index) => (
            <ThemedText key={index} style={styles.trait}>
              {trait}
            </ThemedText>
          ))}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  cardSelected: {
    borderWidth: 3,
    backgroundColor: 'rgba(76, 205, 196, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  traits: {
    gap: 6,
  },
  trait: {
    fontSize: 13,
    opacity: 0.7,
  },
});
