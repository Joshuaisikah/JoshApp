import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, dbService } from '../services/DatabaseService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: User) => Promise<boolean>;
  logout: () => void;
  updateAccount: (user: User) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session (could use AsyncStorage here)
    // For simplicity, we're just setting isLoading to false after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await dbService.loginUser(email, password);
      if (user) {
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (newUser: User): Promise<boolean> => {
    try {
      const success = await dbService.registerUser(newUser);
      if (success) {
        // Automatically log in the user after registration
        const user = await dbService.loginUser(newUser.email, newUser.password);
        if (user) {
          setUser(user);
        }
      }
      return success;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateAccount = async (updatedUser: User): Promise<boolean> => {
    try {
      if (!user?.id) return false;
      
      updatedUser.id = user.id;
      const success = await dbService.updateUser(updatedUser);
      if (success) {
        setUser(updatedUser);
      }
      return success;
    } catch (error) {
      console.error('Update account error:', error);
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!user?.id) return false;
      
      const success = await dbService.deleteUser(user.id);
      if (success) {
        setUser(null);
      }
      return success;
    } catch (error) {
      console.error('Delete account error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateAccount,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
