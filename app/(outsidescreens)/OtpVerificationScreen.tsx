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

const OtpVerificationScreen: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const router = useRouter();

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      alert("Vui lòng nhập đúng mã OTP gồm 6 ký tự.");
      return;
    }

    try {
      const response = await axios.post('http://beejobs.io.vn:14307/api/verify-otp', {
        otp: otpCode,
      });
      console.log('Xác minh OTP thành công:', response.data);
      alert("Xác minh OTP thành công.");
      setOtp(["", "", "", "", "", ""]);
      router.push('ResetPasswordScreen'); // Điều hướng đến màn hình đặt lại mật khẩu
    } catch (error) {
      console.error('Lỗi xác minh OTP:', error);
      alert("Đã xảy ra lỗi trong quá trình xác minh OTP. Vui lòng thử lại sau.");
    }
  };

  const handleChangeOtp = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác minh OTP</Text>
      <Text style={styles.instruction}>
        Nhập mã OTP gồm 6 ký tự mà chúng tôi đã gửi đến email hoặc số điện thoại của bạn.
      </Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleChangeOtp(text, index)}
            maxLength={1}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Xác minh</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('ForgotPasswordScreen')}>
        <Text style={styles.backButtonText}>Quay lại</Text>
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 5,
    width: 40,
    height: 50,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#f9f9f9",
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

export default OtpVerificationScreen;
