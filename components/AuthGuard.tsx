import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const publicPaths = ['/', '/auth/login', '/auth/signup'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      const isPublicPath = publicPaths.includes(pathname);
      
      if (!isAuthenticated && !isPublicPath) {
        // Redirect to login if trying to access a protected route without authentication
        router.replace('/auth/login');
      } else if (isAuthenticated && isPublicPath && pathname !== '/') {
        // Redirect to home if already authenticated and trying to access auth routes
        // But don't redirect from splash screen (/)
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, pathname]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2e78b7" />
      </View>
    );
  }

  return <>{children}</>;
}
