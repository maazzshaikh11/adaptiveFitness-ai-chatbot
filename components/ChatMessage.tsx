import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { parseAIResponse } from '@/services/responseParser';
import { Message } from '@/types';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TipsList } from '@/components/TipsList';
import { ProgressTrackerCard } from '@/components/ProgressTrackerCard';
import { WorkoutPlanCard } from '@/components/WorkoutPlanCard';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // 🟢 1. Detect progress tracker table
  const isProgressTable =
    !isUser &&
    message.content.includes('Weekly Progress') &&
    message.content.includes('Water Intake');

  if (isProgressTable) {
    return (
      <View style={[styles.container, styles.assistantContainer]}>
        <ProgressTrackerCard />
      </View>
    );
  }

  // 🟢 2. Structured AI parsing (ONLY for assistant)
  if (!isUser) {
    const parsed = parseAIResponse(message.content);

    // 🟢 Workout Plan (cards only)
    if (parsed.type === 'workout_plan' && parsed.workoutPlans?.length) {
      return (
        <View style={[styles.container, styles.assistantContainer]}>
          <View style={styles.structuredContainer}>
            {parsed.workoutPlans.map((plan, index) => (
              <WorkoutPlanCard key={index} dayPlan={plan} />
            ))}
          </View>
        </View>
      );
    }

    // 🟢 Tips List
    if (parsed.type === 'tips_list' && parsed.tipsList) {
      return (
        <View style={[styles.container, styles.assistantContainer]}>
          <TipsList
            title={parsed.tipsList.title}
            tips={parsed.tipsList.tips}
          />
        </View>
      );
    }
  }

  // 🟢 3. Long-press copy
  const onLongPress = async () => {
    await Clipboard.setStringAsync(message.content || '');
    Alert.alert('Copied', 'Message copied to clipboard');
  };

  // 🟢 4. Default fallback bubble (ONLY when no structured UI matched)
  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <Pressable onLongPress={onLongPress}>
        <ThemedView
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          <ThemedText style={[styles.text, isUser && styles.userText]}>
            {message.content}
          </ThemedText>

          <ThemedText style={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </ThemedText>
        </ThemedView>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#4ECDC4',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#f6f7f8',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 6,
    textAlign: 'right',
  },
  structuredContainer: {
    width: '95%',
    gap: 8,
  },
});
