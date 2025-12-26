import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { ChatMessage } from '@/components/ChatMessage';
import { CoinAnimation } from '@/components/CoinAnimation';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { QuickActionButton } from '@/components/QuickActionButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { QUICK_ACTION_SUGGESTIONS } from '@/constants/personalities';
import apiService from '@/services/api';
import { enrichPromptWithFAQ, getDirectFAQAnswer, getSuggestedQuestions } from '@/services/ragService';
import { Message } from '@/types';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'new' | 'view' | 'continue'>('new');
  const [initialized, setInitialized] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!initialized) {
      if (params.chatId && params.mode) {
        loadPastChat(params.chatId as string, params.mode as string);
      } else {
        initializeChat();
      }
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [messages.length]);

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

      const userCoins = await apiService.getUserCoins(storedUserId);
      setCoins(userCoins);

      setMessages([
        {
          role: 'assistant',
          content: `Hi there! 👋 I'm your adaptive fitness companion. I can help with workouts, short plans, and motivation. Ask me anything about fitness or tell me your goal.`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert('Error', 'Failed to initialize chat');
    }
  };

  const loadPastChat = async (chatId: string, mode: string) => {
    try {
      setIsLoading(true);
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        Alert.alert('Error', 'User not found');
        router.replace('/');
        return;
      }
      setUserId(storedUserId);
      const chat = await apiService.getSpecificChat(storedUserId, chatId);
      if (chat && chat.messages) {
        setMessages(chat.messages);
        setViewMode(mode === 'continue' ? 'continue' : 'view');
      }
      const userCoins = await apiService.getUserCoins(storedUserId);
      setCoins(userCoins);
    } catch (error) {
      console.error('Error loading past chat:', error);
      Alert.alert('Error', 'Failed to load chat. Starting new conversation.');
      initializeChat();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = (messageText ?? inputText).trim();
    if (!textToSend || !userId) return;

    const userMessage: Message = { role: 'user', content: textToSend, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    inputRef.current?.blur();
    setIsLoading(true);

    try {
      const faqAnswer = getDirectFAQAnswer(textToSend);
      if (faqAnswer) {
        const assistantMessage: Message = { role: 'assistant', content: `${faqAnswer}\n\n💡 *This answer is from our curated fitness FAQ*`, timestamp: new Date() };
        setMessages((prev) => [...prev, assistantMessage]);
        setShowCoinAnimation(true);
        setCoins((prev) => prev + 1);
        const suggestions = getSuggestedQuestions(textToSend);
        setSuggestedQuestions(suggestions);
      } else {
        const enrichedMessage = enrichPromptWithFAQ(textToSend);
        const response = await apiService.sendChatMessage(userId, enrichedMessage);
        const assistantMessage: Message = { role: 'assistant', content: response.response, timestamp: new Date() };
        setMessages((prev) => [...prev, assistantMessage]);
        setCoins(response.coins);
        setShowCoinAnimation(true);
        const suggestions = getSuggestedQuestions(textToSend);
        setSuggestedQuestions(suggestions);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please check your connection and try again.');
      setMessages((prev) => prev.filter((msg) => msg !== userMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (suggestion: string) => {
    const cleanText = suggestion.replace(/[^\w\s-]/g, '').trim();
    handleSendMessage(cleanText);
  };

  const renderItem = ({ item, index }: { item: Message; index: number }) => (
    <ChatMessage message={item} />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
        <CoinAnimation show={showCoinAnimation} onComplete={() => setShowCoinAnimation(false)} />

        {viewMode === 'view' && (
          <ThemedView style={styles.viewModeBanner}>
            <View style={styles.viewModeBannerContent}>
              <ThemedText style={styles.viewModeText}>📖 Viewing past conversation</ThemedText>
              <TouchableOpacity style={styles.continueButton} onPress={() => setViewMode('continue')}>
                <ThemedText style={styles.continueButtonText}>Continue Chat</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}

        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Back">
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <ThemedText type="subtitle" style={styles.headerTitle}>Fitness Coach</ThemedText>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => router.push('/history')} style={styles.historyButton} accessibilityLabel="History">
                <ThemedText style={styles.historyButtonText}>📜</ThemedText>
              </TouchableOpacity>
              <View style={styles.coinsContainer} accessibilityLabel={`Coins ${coins}`}>
                <ThemedText style={styles.coinsText}>🪙 {coins}</ThemedText>
              </View>
            </View>
          </View>
        </ThemedView>

        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, idx) => `${item.role}-${idx}-${item.timestamp?.toString()}`}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        />

        {isLoading && <LoadingIndicator />}

        {suggestedQuestions.length > 0 && !isLoading && (
          <View style={styles.suggestedQuestionsContainer}>
            <ThemedText style={styles.suggestedQuestionsTitle}>💡 Related questions:</ThemedText>
            <View style={styles.suggestedQuestionsList}>
              {suggestedQuestions.map((q, i) => (
                <QuickActionButton key={i} text={q} onPress={() => { handleSendMessage(q); setSuggestedQuestions([]); }} />
              ))}
            </View>
          </View>
        )}

        {messages.length === 1 && !isLoading && (
          <View style={styles.quickActionsContainer}>
            <ThemedText style={styles.quickActionsTitle}>Quick suggestions:</ThemedText>
            <View style={styles.quickActions}>
              {QUICK_ACTION_SUGGESTIONS.map((suggestion, index) => (
                <QuickActionButton key={index} text={suggestion} onPress={() => handleQuickAction(suggestion)} />
              ))}
            </View>
          </View>
        )}

        <ThemedView style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={viewMode === 'view' ? "Viewing past conversation..." : "Ask about fitness, workouts, or wellness..."}
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={800}
            editable={viewMode !== 'view' && !isLoading}
            returnKeyType="send"
            onSubmitEditing={() => handleSendMessage()}
            accessibilityLabel="Message input"
          />

          <Pressable
            style={[styles.sendButton, (viewMode === 'view' || !inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={() => handleSendMessage()}
            disabled={viewMode === 'view' || !inputText.trim() || isLoading}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <ThemedText style={styles.sendButtonText}>{isLoading ? '...' : 'Send'}</ThemedText>
          </Pressable>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  viewModeBanner: { backgroundColor: 'rgba(78,205,196,0.08)', borderBottomWidth: 1, borderBottomColor: '#4ECDC4', paddingHorizontal: 16, paddingVertical: 12 },
  viewModeBannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewModeText: { fontSize: 14, color: '#4ECDC4', fontWeight: '600' },
  continueButton: { backgroundColor: '#4ECDC4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  continueButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { marginRight: 12 },
  backButtonText: { fontSize: 26, fontWeight: '700' },
  headerContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  historyButton: { padding: 6 },
  historyButtonText: { fontSize: 20 },
  coinsContainer: { backgroundColor: '#FFD700', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  coinsText: { fontSize: 14, fontWeight: '700' },
  messagesContent: { paddingHorizontal: 12, paddingBottom: 12, paddingTop: 6 },
  quickActionsContainer: { paddingHorizontal: 16, marginTop: 10 },
  quickActionsTitle: { fontSize: 14, opacity: 0.7, marginBottom: 8 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap' },
  suggestedQuestionsContainer: { paddingHorizontal: 16, marginTop: 8 },
  suggestedQuestionsTitle: { fontSize: 14, opacity: 0.8, marginBottom: 8, fontWeight: '600' },
  suggestedQuestionsList: { flexDirection: 'row', flexWrap: 'wrap' },
  inputContainer: { flexDirection: 'row', padding: 12, paddingBottom: Platform.OS === 'ios' ? 24 : 12, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#f7f7f8', borderRadius: 22, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, maxHeight: 120 },
  sendButton: { backgroundColor: '#4ECDC4', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
