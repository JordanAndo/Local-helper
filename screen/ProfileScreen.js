import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation(); // Initialize navigation

  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('@username');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91-8129999999');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Avenue 2nd Street NW SY');
  const [dob, setDob] = useState('12-05-1990');

  // Function to handle profile image selection
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={image ? { uri: image } : require('../assets/image/cleaning1.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>{name || '@username'}</Text>
        <Text style={styles.email}>{email || 'developer@appsnipp.com'}</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')} // Navigate to HomeScreen
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.accountInfo}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Enter Name"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Mobile:</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={(text) => setPhone(text)}
            keyboardType="phone-pad"
            placeholder="Enter Mobile"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            placeholder="Enter Email"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={(text) => setAddress(text)}
            placeholder="Enter Address"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>D.O.B:</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={(text) => setDob(text)}
            placeholder="Enter D.O.B"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'orange',
    paddingVertical: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  email: {
    color: '#fff',
    fontSize: 14,
  },
  backButton: {
    backgroundColor: '#C2185B',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  accountInfo: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    width: 70,
    color: '#555',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    padding: 5,
    fontSize: 16,
  },
});

export default ProfileScreen;
