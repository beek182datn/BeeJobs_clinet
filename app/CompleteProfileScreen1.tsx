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
      
      <Text style={styles.sectionHeader}>Thông tin cá nhân</Text>
      <View style={styles.section}>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#A9A9A9" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Tên"
            value={name}
            onChangeText={setName}
          />
        </View>
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#A9A9A9" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#A9A9A9" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ Gmail"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default CompleteProfileScreen1;
