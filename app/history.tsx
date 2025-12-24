import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import apiService from '@/services/api';

interface ChatHistory {
  _id: string;
  userId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert('Error', 'User not found');
        router.replace('/');
        return;
      }

      const history = await apiService.getChatHistory(userId, 10);
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
      Alert.alert('Error', 'Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return `Today, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (d.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getFirstUserMessage = (chat: ChatHistory): string => {
    const firstUserMsg = chat.messages.find(m => m.role === 'user');
    return firstUserMsg?.content.slice(0, 60) + (firstUserMsg?.content.length! > 60 ? '...' : '') || 'New conversation';
  };

  const getMessageCount = (chat: ChatHistory): number => {
    return chat.messages.filter(m => m.role === 'user').length;
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <ThemedText style={styles.loadingText}>Loading chat history...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Chat History
        </ThemedText>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {chatHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyIcon}>💬</ThemedText>
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No chat history yet
            </ThemedText>
            <ThemedText style={styles.emptyDescription}>
              Start a conversation to see your chat history here
            </ThemedText>
            <TouchableOpacity
              style={styles.startChatButton}
              onPress={() => router.push('/chat')}
            >
              <ThemedText style={styles.startChatButtonText}>Start Chatting</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ThemedText style={styles.historyCount}>
              {chatHistory.length} conversation{chatHistory.length !== 1 ? 's' : ''}
            </ThemedText>
            {chatHistory.map((chat, index) => (
              <TouchableOpacity
                key={chat._id || index}
                style={styles.chatCard}
                onPress={() => {
                  // Future: Navigate to specific chat
                  Alert.alert('Chat Preview', getFirstUserMessage(chat));
                }}
                activeOpacity={0.7}
              >
                <View style={styles.chatCardHeader}>
                  <ThemedText style={styles.chatDate}>
                    {formatDate(chat.updatedAt || chat.createdAt)}
                  </ThemedText>
                  <View style={styles.messageCountBadge}>
                    <ThemedText style={styles.messageCountText}>
                      {getMessageCount(chat)} messages
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.chatPreview} numberOfLines={2}>
                  {getFirstUserMessage(chat)}
                </ThemedText>
                <View style={styles.chatCardFooter}>
                  <ThemedText style={styles.viewButton}>View →</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerTitle: {
    fontSize: 24,
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  historyCount: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
  },
  chatCard: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  chatCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chatDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  messageCountBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  chatPreview: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  chatCardFooter: {
    alignItems: 'flex-end',
  },
  viewButton: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  startChatButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  startChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
