// Import các thư viện cần thiết
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// Định nghĩa thành phần CompleteProfileScreen và styles
const CompleteProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>
          Vui lòng hoàn thành hồ sơ của bạn để chúng tôi có thể mang lại cho bạn trải nghiệm tốt nhất
        </Text>
        <Image
          source={require('../assets/images/profile.png')} 
          style={styles.image}
        />
      </View>
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.skipText}>Bỏ qua</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  text: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  continueButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  skipText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default CompleteProfileScreen;
