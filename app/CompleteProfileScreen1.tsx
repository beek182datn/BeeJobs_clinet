import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from 'expo-router';

const CompleteProfileScreen1: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    address: ''
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="arrow-left" size={20} color="#000" />
        <Text style={styles.header}>Thiết lập hồ sơ của bạn</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={styles.progress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 20,
  },
  progress: {
    height: '100%',
    width: '50%',
    backgroundColor: '#6200EE',
    borderRadius: 5,
  },
});

export default CompleteProfileScreen1;
