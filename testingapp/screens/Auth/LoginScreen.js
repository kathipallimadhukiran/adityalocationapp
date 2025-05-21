import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebase } from '../../services/firebase';
import { fetchUser } from '../../services/firestoreService';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'error' or 'success'
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      if (!userCredential.user.emailVerified) {
        setMessageType('error');
        setMessage('Please verify your email before logging in.');
        return;
      }

      const userData = await fetchUser(email);
      if (userData) {
        setMessageType('success');
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigation.replace('Dashboard', { user: userData }), 1500);
      } else {
        setMessageType('error');
        setMessage('User data not found in Firestore.');
      }
    } catch (err) {
      setMessageType('error');
      setMessage(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>ADITYA UNIVERSITY</Text>

          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../../assets/lottie/loginlottie.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>

          <Text style={styles.title}>Email Login</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#a1a1aa"
          />
<View style={styles.passwordWrapper}>
  <TextInput
    placeholder="Password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    style={styles.passwordInput}
    placeholderTextColor="#a1a1aa"
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


          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, styles.signupButtonText]}>Go to Sign Up</Text>
          </TouchableOpacity>

          {message ? (
            <Text style={[styles.message, messageType === 'error' ? styles.error : styles.success]}>
              {message}
            </Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff7ed', // light warm background
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
    color: '#ea580c', // deep orange
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 25,
    fontFamily: 'HelveticaNeue-Bold',
  },
  lottieContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  lottie: {
    width: windowWidth * 0.6,
    height: windowWidth * 0.6,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#16a34a', // green
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Medium',
  },
  input: {
    height: 52,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    borderRadius: 12,
    borderColor: '#f97316', // orange border
    borderWidth: 1.8,
    marginBottom: 22,
    fontSize: 17,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    color: '#1f2937', // dark slate text
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  button: {
    backgroundColor: '#ea580c', // orange
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 8,
  },
  signupButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 19,
  },
  signupButtonText: {
    color: '#16a34a',
    fontWeight: '700',
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
    color: '#dc2626', // red
  },
  success: {
    color: '#16a34a', // green
  },
 passwordWrapper: {
  position: 'relative',
  marginBottom: 28,
},

passwordInput: {
  height: 52,
  backgroundColor: '#fff',
  paddingHorizontal: 18,
  paddingRight: 48, // <-- extra padding for eye icon space
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
  top: '35%',
  transform: [{ translateY: -12 }], // vertically center (24/2=12)
  padding: 5,

},

});
