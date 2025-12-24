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
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChatMessage } from '@/components/ChatMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { QuickActionButton } from '@/components/QuickActionButton';
import { CoinAnimation } from '@/components/CoinAnimation';
import { Message } from '@/types';
import apiService from '@/services/api';
import { QUICK_ACTION_SUGGESTIONS } from '@/constants/personalities';
import { getDirectFAQAnswer, getSuggestedQuestions, enrichPromptWithFAQ } from '@/services/ragService';

export default function ChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

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
      // RAG: Check if we have a direct FAQ answer
      const faqAnswer = getDirectFAQAnswer(textToSend);
      
      if (faqAnswer) {
        // Use FAQ answer directly (faster, no API call needed)
        const assistantMessage: Message = {
          role: 'assistant',
          content: `${faqAnswer}\n\n💡 *This answer is from our curated fitness FAQ*`,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        
        // Still award coin and increment on backend
        setShowCoinAnimation(true);
        setCoins((prev) => prev + 1);
        
        // Get suggested follow-up questions
        const suggestions = getSuggestedQuestions(textToSend);
        setSuggestedQuestions(suggestions);
      } else {
        // Enrich prompt with FAQ context
        const enrichedMessage = enrichPromptWithFAQ(textToSend);
        
        // Send message to backend (with enriched context)
        const response = await apiService.sendChatMessage(userId, enrichedMessage);

        // Add AI response to chat
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setCoins(response.coins);
        
        // Show coin animation
        setShowCoinAnimation(true);
        
        // Get suggested follow-up questions
        const suggestions = getSuggestedQuestions(textToSend);
        setSuggestedQuestions(suggestions);
      }
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
      <CoinAnimation 
        show={showCoinAnimation} 
        onComplete={() => setShowCoinAnimation(false)} 
      />
      
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>←</ThemedText>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Fitness Coach
          </ThemedText>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={() => router.push('/history')} 
              style={styles.historyButton}
            >
              <ThemedText style={styles.historyButtonText}>📜</ThemedText>
            </TouchableOpacity>
            <View style={styles.coinsContainer}>
              <ThemedText style={styles.coinsText}>🪙 {coins}</ThemedText>
            </View>
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

        {suggestedQuestions.length > 0 && !isLoading && (
          <View style={styles.suggestedQuestionsContainer}>
            <ThemedText style={styles.suggestedQuestionsTitle}>
              💡 Related questions:
            </ThemedText>
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestedQuestionButton}
                onPress={() => {
                  handleSendMessage(question);
                  setSuggestedQuestions([]);
                }}
              >
                <ThemedText style={styles.suggestedQuestionText}>
                  {question}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyButton: {
    padding: 4,
  },
  historyButtonText: {
    fontSize: 24,
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
  suggestedQuestionsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  suggestedQuestionsTitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    fontWeight: '600',
  },
  suggestedQuestionButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderWidth: 1,
    borderColor: '#4ECDC4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  suggestedQuestionText: {
    fontSize: 14,
    color: '#4ECDC4',
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
