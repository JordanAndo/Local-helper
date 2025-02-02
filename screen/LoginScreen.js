import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { auth } from '../Firebase/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const route = useRoute();
  const { onLogin } = route.params;

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          onLogin();
        } else {
          Alert.alert('Email not verified', 'Please verify your email before logging in.');
        }
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('No Account Found', 'It seems like you don’t have an account. Please sign up.');
        } else {
          Alert.alert('Login Error', error.message);
        }
      });
  };

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Password and Confirm Password must be the same.');
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(user)
          .then(() => {
            Alert.alert('Account Created', 'Your account was created successfully. Please verify your email.');
            setIsNewUser(false);
            clearFields();
          })
          .catch((error) => {
            Alert.alert('Verification Error', error.message);
          });
      })
      .catch((error) => {
        Alert.alert('Signup Error', error.message);
      });
  };

  const toggleUserMode = () => {
    setIsNewUser(!isNewUser);
    clearFields();
  };

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image 
          source={require('../assets/image/image4.png')}
          style={styles.serviceImage} 
        />
        <View style={styles.content}>
          <Text style={styles.title}>{isNewUser ? 'Sign Up' : 'Login'}</Text>

          <TextInput 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail} 
            style={styles.input} 
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput 
              placeholder="Password" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={!showPassword}
              style={styles.passwordInput} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color="grey" 
                style={styles.eyeIcon} 
              />
            </TouchableOpacity>
          </View>

          {isNewUser && (
            <View style={styles.passwordContainer}>
              <TextInput 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry={!showConfirmPassword}
                style={styles.passwordInput} 
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="grey" 
                  style={styles.eyeIcon} 
                />
              </TouchableOpacity>
            </View>
          )}

          {isNewUser ? (
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.switchText} onPress={toggleUserMode}>
            {isNewUser ? 'Already have an account? Login' : 'Don’t have an account? Sign Up'}
          </Text>

          <TouchableOpacity style={styles.googleButton}>
            <Image 
              source={require('../assets/image/google.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    width: '90%',
    padding: 20,
    backgroundColor: "#fff",
  },
  serviceImage: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#193141',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  eyeIcon: {
    padding: 5,
  },
  switchText: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: "#333",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    color: '#000',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#228B22',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
