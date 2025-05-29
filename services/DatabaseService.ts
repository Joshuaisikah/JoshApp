import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
}

// Temporary mock data for testing
const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '555-1234',
    location: 'New York'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '555-5678',
    location: 'San Francisco'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    location: 'Chicago'
  }
];

// Keys for AsyncStorage
const USERS_STORAGE_KEY = '@josh_app_users';
const CURRENT_USER_ID_KEY = '@josh_app_current_user_id';

class DatabaseService {
  private users: User[] = [...mockUsers];
  private nextId = 4; // Start with ID 4 since we have 3 mock users

  constructor() {
    // Try to load stored users from AsyncStorage
    this.loadUsersFromStorage();
  }

  private async loadUsersFromStorage() {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        this.nextId = Math.max(...this.users.map(u => u.id || 0)) + 1;
      }
    } catch (error) {
      console.error('Error loading users from AsyncStorage', error);
    }
  }

  private async saveUsersToStorage() {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving users to AsyncStorage', error);
    }
  }

  registerUser(user: User): Promise<boolean> {
    return new Promise((resolve) => {
      // Check if email already exists
      if (this.users.some(u => u.email === user.email)) {
        resolve(false);
        return;
      }

      const newUser = { ...user, id: this.nextId++ };
      this.users.push(newUser);
      this.saveUsersToStorage();
      resolve(true);
    });
  }

  loginUser(email: string, password: string): Promise<User | null> {
    return new Promise((resolve) => {
      const user = this.users.find(u => u.email === email && u.password === password);
      resolve(user || null);
    });
  }

  getUserById(id: number): Promise<User | null> {
    return new Promise((resolve) => {
      const user = this.users.find(u => u.id === id);
      resolve(user || null);
    });
  }

  updateUser(user: User): Promise<boolean> {
    return new Promise((resolve) => {
      if (!user.id) {
        resolve(false);
        return;
      }

      const index = this.users.findIndex(u => u.id === user.id);
      if (index === -1) {
        resolve(false);
        return;
      }

      this.users[index] = user;
      this.saveUsersToStorage();
      resolve(true);
    });
  }

  deleteUser(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      const initialLength = this.users.length;
      this.users = this.users.filter(u => u.id !== id);
      
      if (this.users.length !== initialLength) {
        this.saveUsersToStorage();
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  getAllMembers(): Promise<User[]> {
    return new Promise((resolve) => {
      resolve([...this.users]);
    });
  }
}

// Create a single instance of the database service
const dbService = new DatabaseService();

// Export the service instance
export { dbService };
