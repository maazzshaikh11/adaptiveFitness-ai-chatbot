import { PersonalityType, ChatResponse, LifestyleData, User } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

class ApiService {
  async createUser(userId: string, personality: PersonalityType): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, personality }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateLifestyleData(userId: string, lifestyleData: LifestyleData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/lifestyle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lifestyleData),
      });

      if (!response.ok) {
        throw new Error('Failed to update lifestyle data');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error updating lifestyle data:', error);
      throw error;
    }
  }

  async sendChatMessage(userId: string, message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  async getChatHistory(userId: string, limit: number = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/${userId}?limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();
      return data.chats;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  async getUserCoins(userId: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/coins`);

      if (!response.ok) {
        throw new Error('Failed to fetch coins');
      }

      const data = await response.json();
      return data.coins;
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default new ApiService();
