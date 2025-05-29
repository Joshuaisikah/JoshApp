import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, View, Text, StatusBar, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function UpdateProfileScreen() {
  const { user, updateAccount } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;

    // Basic validation
    if (!name || !email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    if (password && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = {
        ...user,
        name,
        email,
        password: password || user.password, // Keep old password if not changing
        phone,
        location
      };
      
      const success = await updateAccount(updatedUser);
      
      if (success) {
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-circle-outline" size={70} color="#ccc" />
          <Text style={styles.errorText}>Please log in to update your profile</Text>
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
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <Ionicons name="arrow-back" size={24} color="#2e78b7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#a0a0a0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#a0a0a0"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Password</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <Text style={styles.inputNote}>Leave blank to keep current password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#a0a0a0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#a0a0a0"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Contact Details</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.inputNote}>Optional</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#a0a0a0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.inputNote}>Optional</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your location"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#a0a0a0"
              />
            </View>
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.updateButton, isLoading && styles.buttonDisabled]}
              onPress={handleUpdateProfile}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="white" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>
                    Save Changes
                  </Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Ionicons name="close-outline" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e78b7',
    marginTop: 20,
    marginBottom: 12,
    paddingLeft: 4,
  },
  inputGroup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
  },
  requiredStar: {
    color: '#e74c3c',
  },
  inputNote: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e5eb',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9fafc',
  },
  buttonsContainer: {
    marginTop: 24,
    gap: 12,
  },
  updateButton: {
    backgroundColor: '#2e78b7',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#2e78b7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButton: {
    backgroundColor: '#7f8c8d',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0c4e4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
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
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#2e78b7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#2e78b7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
