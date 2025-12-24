import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChatMessage } from '@/components/ChatMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { QuickActionButton } from '@/components/QuickActionButton';
import { Message } from '@/types';
import apiService from '@/services/api';
import { QUICK_ACTION_SUGGESTIONS } from '@/constants/personalities';

export default function ChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isLoading]);

  const initializeChat = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const personality = await AsyncStorage.getItem('personality');

      if (!storedUserId || !personality) {
        Alert.alert('Error', 'Please set up your profile first');
        router.replace('/');
        return;
      }

      setUserId(storedUserId);

      // Fetch user coins
      const userCoins = await apiService.getUserCoins(storedUserId);
      setCoins(userCoins);

      // Add welcome message
      setMessages([
        {
          role: 'assistant',
          content: `Hi there! 👋 I'm your adaptive fitness companion. I'm here to help you with workouts, fitness tips, and staying motivated on your fitness journey!\n\nFeel free to ask me anything about fitness, workouts, or wellness. What would you like to know?`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert('Error', 'Failed to initialize chat');
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    
    if (!textToSend || !userId) return;

    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await apiService.sendChatMessage(userId, textToSend);

      // Add AI response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCoins(response.coins);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please check your connection and try again.');
      
      // Remove the user message if sending failed
      setMessages((prev) => prev.filter((msg) => msg !== userMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (suggestion: string) => {
    // Remove emoji and send as message
    const cleanText = suggestion.replace(/[^\w\s-]/g, '').trim();
    handleSendMessage(cleanText);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>←</ThemedText>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Fitness Coach
          </ThemedText>
          <View style={styles.coinsContainer}>
            <ThemedText style={styles.coinsText}>🪙 {coins}</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && <LoadingIndicator />}

        {messages.length === 1 && !isLoading && (
          <View style={styles.quickActionsContainer}>
            <ThemedText style={styles.quickActionsTitle}>Quick suggestions:</ThemedText>
            <View style={styles.quickActions}>
              {QUICK_ACTION_SUGGESTIONS.map((suggestion, index) => (
                <QuickActionButton
                  key={index}
                  text={suggestion}
                  onPress={() => handleQuickAction(suggestion)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about fitness, workouts, or wellness..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
        >
          <ThemedText style={styles.sendButtonText}>Send</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
  },
  coinsContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  coinsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  quickActionsTitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
