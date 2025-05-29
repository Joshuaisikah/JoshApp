import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      })
    ]).start();

    // Navigate to auth screen after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/auth/login');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }]}
        >
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/adaptive-icon.png')} 
              style={styles.logo}
            />
          </View>

          <Text style={styles.title}>JoshApp</Text>
          <Text style={styles.subtitle}>React Native Mobile App</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e78b7',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    backgroundColor: 'white',
    borderRadius: 75,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
});
