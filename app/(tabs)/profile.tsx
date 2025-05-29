import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, ScrollView, View, Text, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../services/DatabaseService';

export default function ProfileScreen() {
  const { user, logout, updateAccount, deleteAccount } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateAccount = () => {
    if (!user) return;
    
    router.push('/profile/update');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const success = await deleteAccount();
              if (success) {
                Alert.alert('Success', 'Your account has been deleted', [
                  { text: 'OK', onPress: () => router.replace('/auth/login') }
                ]);
              } else {
                Alert.alert('Error', 'Failed to delete account');
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'An error occurred while deleting account');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-circle-outline" size={70} color="#ccc" />
          <Text style={styles.errorText}>Please log in to view your profile</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
            </View>
            <View style={styles.profileNameContainer}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-outline" size={20} color="#2e78b7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="mail-outline" size={20} color="#2e78b7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
            
            {user.phone && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="call-outline" size={20} color="#2e78b7" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>{user.phone}</Text>
                  </View>
                </View>
              </>
            )}
            
            {user.location && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="location-outline" size={20} color="#2e78b7" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{user.location}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleUpdateAccount}
              disabled={isLoading}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="create-outline" size={22} color="#2e78b7" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionText}>Update Account</Text>
                <Text style={styles.actionDescription}>Edit your profile information</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#bbb" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleDeleteAccount}
              disabled={isLoading}
            >
              <View style={[styles.actionIcon, styles.deleteIcon]}>
                <Ionicons name="trash-outline" size={22} color="#e74c3c" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionText, styles.deleteText]}>Delete Account</Text>
                <Text style={styles.actionDescription}>Permanently delete your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#bbb" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Ionicons name="log-out-outline" size={20} color="white" style={styles.logoutIcon} />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>JoshApp v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#2e78b7',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  profileNameContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
    paddingLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(46, 120, 183, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 50,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(46, 120, 183, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  deleteIcon: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  actionContent: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  deleteText: {
    color: '#e74c3c',
  },
  actionDescription: {
    fontSize: 12,
    color: '#888',
  },
  logoutButton: {
    backgroundColor: '#7f8c8d',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: '#2e78b7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 16,
    shadowColor: '#2e78b7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  footer: {
    alignItems: 'center',
    padding: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
