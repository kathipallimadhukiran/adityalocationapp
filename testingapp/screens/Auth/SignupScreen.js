import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebase } from '../../services/firebase';
import { saveUser } from '../../services/firestoreService';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;

const ADITYA_EMAIL_DOMAIN = '@aec.edu.in'|| '@AEC.EDU.IN';

export default function SignupScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'error' or 'success'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simple email domain validation function
  const isValidAdityaEmail = (email) => {
    return email.toLowerCase().endsWith(ADITYA_EMAIL_DOMAIN);
  };

  const handleSignup = useCallback(async () => {
    // Trim inputs to avoid spaces
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    setMessage('');
    setMessageType('');

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setMessageType('error');
      setMessage('Please fill in all fields.');
      return;
    }

    if (!isValidAdityaEmail(trimmedEmail)) {
      setMessageType('error');
      setMessage(`Email must be a valid Aditya University email (${ADITYA_EMAIL_DOMAIN}).`);
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(trimmedEmail, trimmedPassword);

      await userCredential.user.sendEmailVerification();

      // Save user data to Firestore
      await saveUser(trimmedEmail, trimmedName);

      setMessageType('success');
      setMessage('Registered! Please check your email for verification.');

      // Optional: Navigate to login or another screen after a delay
      // setTimeout(() => navigation.navigate('LoginScreen'), 3000);

    } catch (error) {
      let friendlyMessage = error.message;

      // Map some common Firebase auth errors to friendlier messages
      switch (error.code) {
        case 'auth/email-already-in-use':
          friendlyMessage = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          friendlyMessage = 'Invalid email format.';
          break;
        case 'auth/weak-password':
          friendlyMessage = 'Password should be at least 6 characters.';
          break;
        default:
          friendlyMessage = error.message;
      }

      setMessageType('error');
      setMessage(friendlyMessage);
    } finally {
      setLoading(false);
    }
  }, [name, email, password, confirmPassword]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Text style={styles.heading}>ADITYA UNIVERSITY</Text>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.instruction}>
              Only users with a valid Aditya University email registered in our college database
              are allowed to sign up. If your email is not recognized, registration will be denied.
            </Text>

            <TextInput
              placeholder="Full Name"
              onChangeText={setName}
              value={name}
              style={styles.input}
              placeholderTextColor="#a1a1aa"
              autoCapitalize="words"
              editable={!loading}
            />

            <TextInput
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor="#a1a1aa"
              editable={!loading}
            />

            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                placeholderTextColor="#a1a1aa"
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                activeOpacity={0.7}
              >
                <Icon
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color="#f97316"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Confirm Password"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={styles.passwordInput}
                placeholderTextColor="#a1a1aa"
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
                activeOpacity={0.7}
              >
                <Icon
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color="#f97316"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleSignup}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {message ? (
              <Text
                style={[
                  styles.message,
                  messageType === 'error' ? styles.error : styles.success,
                ]}
              >
                {message}
              </Text>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff7ed',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  heading: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ea580c',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 10,
    fontFamily: 'HelveticaNeue-Bold',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#16a34a',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Medium',
  },
  instruction: {
    textAlign: 'center',
    color: '#737373',
    fontSize: 14,
    marginBottom: 25,
    fontFamily: 'HelveticaNeue',
  },
  input: {
    height: 52,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    borderRadius: 12,
    borderColor: '#f97316',
    borderWidth: 1.8,
    marginBottom: 22,
    fontSize: 17,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    color: '#1f2937',
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 28,
  },
  passwordInput: {
    height: 52,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingRight: 48,
    borderRadius: 12,
    borderColor: '#f97316',
    borderWidth: 1.8,
    fontSize: 17,
    color: '#1f2937',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 5,
  },
  button: {
    backgroundColor: '#ea580c',
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 19,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'HelveticaNeue-Medium',
  },
  error: {
    color: '#dc2626',
  },
  success: {
    color: '#16a34a',
  },
});
