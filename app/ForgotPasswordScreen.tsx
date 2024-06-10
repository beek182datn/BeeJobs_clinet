import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useRouter } from 'expo-router';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleResetPassword = async () => {
    if (email.trim() === "") {
      alert("Xin vui lòng điền email của bạn.");
      return;
    }

    try {
      const response = await axios.post('http://beejobs.io.vn:14307/api/forgot-password', {
        email: email,
      });
      console.log('Yêu cầu đặt lại mật khẩu thành công:', response.data);
      alert("Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.");
      setEmail("");
      router.push('LoginScreen');
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu:', error);
      alert("Đã xảy ra lỗi trong quá trình đặt lại mật khẩu. Vui lòng thử lại sau.");
    }
  };

  const navigateToLogin = () => {
    router.push('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.instruction}>
        Nhập email hoặc số điện thoại của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu.
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email hoặc số điện thoại"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
        <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 30,
  },
  instruction: {
    fontSize: 16,
    color: "#A9A9A9",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  input: {
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    borderColor: "#007BFF",
    borderWidth: 1,
  },
  backButtonText: {
    color: "#007BFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;
