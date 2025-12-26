import { ChatResponse, LifestyleData, PersonalityType, User } from '@/types';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://adaptive-fitness-bay.vercel.app';

class ApiService {
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5000; // 5 seconds cache

  private getCachedData(key: string): any | null {
    const cached = this.requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.requestCache.set(key, { data, timestamp: Date.now() });
  }

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
      
      // Invalidate coins cache since it's updated
      this.requestCache.delete(`coins:${userId}`);
      
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
    const cacheKey = `coins:${userId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached !== null) {
      return cached;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/coins`);

      if (!response.ok) {
        throw new Error('Failed to fetch coins');
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data.coins);
      return data.coins;
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw error;
    }
  }

  async getSpecificChat(userId: string, chatId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/${userId}/${chatId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch specific chat');
      }

      const data = await response.json();
      return data.chat;
    } catch (error) {
      console.error('Error fetching specific chat:', error);
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
