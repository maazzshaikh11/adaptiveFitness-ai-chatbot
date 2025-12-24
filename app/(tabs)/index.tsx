import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PersonalityCard } from '@/components/PersonalityCard';
import { PERSONALITIES } from '@/constants/personalities';
import { PersonalityType } from '@/types';
import apiService from '@/services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const [showPersonalitySelection, setShowPersonalitySelection] = useState(true);

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const personality = await AsyncStorage.getItem('personality');

      if (userId && personality) {
        setHasUser(true);
        setSelectedPersonality(personality as PersonalityType);
        setShowPersonalitySelection(false);
      }
    } catch (error) {
      console.error('Error checking existing user:', error);
    }
  };

  const handleChangePersonality = () => {
    setShowPersonalitySelection(true);
  };

  const handleStartChat = async () => {
    if (!selectedPersonality) {
      Alert.alert('Select Personality', 'Please select your personality type to continue.');
      return;
    }

    setIsLoading(true);
    try {
      let userId = await AsyncStorage.getItem('userId');

      // If user exists but personality changed, update it
      if (hasUser && userId) {
        await AsyncStorage.setItem('personality', selectedPersonality);
        // Update backend with new personality
        await apiService.createUser(userId, selectedPersonality);
      } else {
        // Generate a unique user ID for new user
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create user in backend
        await apiService.createUser(userId, selectedPersonality);

        // Store user data locally
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('personality', selectedPersonality);
      }

      // Navigate to chat screen
      router.push('/chat');
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert('Error', 'Failed to initialize. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueChat = () => {
    router.push('/chat');
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            💪 Fitness Companion
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Your AI-powered adaptive fitness coach
          </ThemedText>
        </View>

        <ThemedView style={styles.infoBox}>
          <ThemedText type="subtitle" style={styles.infoTitle}>
            ✓ What I Can Help With:
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Create personalized workout plans{'\n'}
            • Provide fitness tips and techniques{'\n'}
            • Offer motivation and consistency advice{'\n'}
            • Guide you on general wellness{'\n'}
            • Answer fitness-related questions
          </ThemedText>

          <ThemedText type="subtitle" style={[styles.infoTitle, styles.warningTitle]}>
            ✗ What I Cannot Do:
          </ThemedText>
          <ThemedText style={styles.warningText}>
            • Provide medical advice{'\n'}
            • Diagnose or treat injuries{'\n'}
            • Recommend medications{'\n'}
            • Replace professional healthcare
          </ThemedText>

          <ThemedText style={styles.disclaimer}>
            For medical concerns, always consult a licensed healthcare professional.
          </ThemedText>
        </ThemedView>

        {!hasUser && (
          <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Choose Your Personality
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              This helps me adapt my coaching style to support you better
            </ThemedText>

            {PERSONALITIES.map((personality) => (
              <PersonalityCard
                key={personality.id}
                personality={personality}
                isSelected={selectedPersonality === personality.id}
                onSelect={() => setSelectedPersonality(personality.id)}
              />
            ))}
          </>
        )}

        {hasUser && !showPersonalitySelection && (
          <ThemedView style={styles.currentPersonalityBox}>
            <ThemedText type="subtitle" style={styles.currentPersonalityTitle}>
              Current Personality: {PERSONALITIES.find(p => p.id === selectedPersonality)?.title}
            </ThemedText>
            <ThemedText style={styles.currentPersonalityDescription}>
              {PERSONALITIES.find(p => p.id === selectedPersonality)?.description}
            </ThemedText>
            <TouchableOpacity
              style={styles.changePersonalityButton}
              onPress={handleChangePersonality}
            >
              <ThemedText style={styles.changePersonalityText}>
                Change Personality
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

        {hasUser && showPersonalitySelection && (
          <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Choose Your Personality
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Select a different personality to change your coaching style
            </ThemedText>

            {PERSONALITIES.map((personality) => (
              <PersonalityCard
                key={personality.id}
                personality={personality}
                isSelected={selectedPersonality === personality.id}
                onSelect={() => setSelectedPersonality(personality.id)}
              />
            ))}
          </>
        )}

        <TouchableOpacity
          style={[styles.startButton, isLoading && styles.startButtonDisabled]}
          onPress={hasUser ? (showPersonalitySelection ? handleStartChat : handleContinueChat) : handleStartChat}
          disabled={isLoading || (!hasUser && !selectedPersonality) || (hasUser && showPersonalitySelection && !selectedPersonality)}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.startButtonText}>
            {isLoading ? 'Starting...' : (hasUser && !showPersonalitySelection) ? 'Continue Chat' : 'Start Chat'}
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Your fitness journey begins here 🚀
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  infoBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(76, 205, 196, 0.1)',
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  infoTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: '#4ECDC4',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  warningTitle: {
    color: '#FF6B6B',
  },
  warningText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    opacity: 0.8,
  },
  disclaimer: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 32,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
  },
  currentPersonalityBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(76, 205, 196, 0.1)',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  currentPersonalityTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: '#4ECDC4',
  },
  currentPersonalityDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 12,
  },
  changePersonalityButton: {
    backgroundColor: '#4ECDC4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  changePersonalityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
