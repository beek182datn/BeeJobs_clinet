import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
const CompleteProfileScreen2: React.FC = () => {
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

  const handleContinue = () => {
    const newErrors = {
      name: name ? '' : '',
      phone: phone ? '' : '',
      email: email ? '' : '',
      age: age ? '' : '',
      gender: gender ? '' : '',
      address: address ? '' : 'Kinh nghiệm làm việc không được bỏ trống'
    };

    setErrors(newErrors);

    const noErrors = Object.values(newErrors).every(error => !error);
    
    if (noErrors) {
      router.push('/Home');
    }
  };

  const skipnow = () => {
    router.push('/Home');
  }

  return (
    <ScrollView>
      <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="arrow-left" size={20} color="#000" onPress={router.back} />
        <Text style={styles.header}>Thiết lập hồ sơ của bạn</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={styles.progress} />
      </View>
      
      <Text style={styles.sectionHeader}>Thông tin cá nhân</Text>
      <View style={styles.section}>
        <View style={styles.inputContainer}>
          <Icon name="book" size={20} color="#A9A9A9" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Skills"
            value={name}
            onChangeText={setName}
          />
        </View>
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="certificate-outline" size={20} color="#A9A9A9" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Giấy chứng nhận"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
        <View style={styles.inputContainer}>
        <MaterialIcons name="interests" size={20} color="#A9A9A9" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Sở thích"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        
      </View>
      
      <Text style={styles.sectionHeader}>Kinh nghiệm</Text>
      <View style={styles.section}>
        <View style={styles.inputContainer}>
        <Entypo name="briefcase" size={20} color="#A9A9A9" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Kinh nghiệm làm việc"
            value={address}
            onChangeText={setAddress}
          />
        </View>
        {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Hoàn thành</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={skipnow}>
        <Text style={styles.skipText}>Bỏ qua</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10
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
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginBottom: 20,
  },
  progress: {
    height: '100%',
    width: '50%',
    backgroundColor: '#e0e0e0',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  icon: {
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  skipText: {
    color: '#6200EE',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default CompleteProfileScreen2;
