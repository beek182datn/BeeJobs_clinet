import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AlertComponent from "@/components/AlertComponent";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "expo-router";
import { BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import CheckBox from '@react-native-community/checkbox';

const RegisterScreen = () => {
  const [accout_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwd, setPassword] = useState("");
  const [passwd2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const router = useRouter();
  const [showMissingInfoAlert, setShowMissingInfoAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [backPressedCount, setBackPressedCount] = useState(0);
  const [errors, setErrors] = useState({
    accout_name: "",
    email: "",
    passwd: "",
    passwd2: "",
  });
  useEffect(() => {
    const backAction = () => {
      router.replace("LoginScreen");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    const newErrors = {
      accout_name: accout_name ? "" : "Cho chúng tôi biết họ và tên của bạn",
      email: email ? "" : "Cho chúng tôi biết email của bạn",
      passwd: passwd ? "" : "Mật khẩu không được trống",
      passwd2: passwd2 ? "" : "Xác nhận mật khẩu không được trống",
    };

    setErrors(newErrors);

    const noErrors = Object.values(newErrors).every((error) => !error);
    if (noErrors) {
      setLoading(true);
      if (!isValidEmail(email)) {
        setMessage("Email không hợp lệ");
        setColor("red");
        setShowMissingInfoAlert(true);
        return;
      }
      if (passwd != passwd2) {
        setMessage("Mật khẩu không khớp");
        setColor("red");
        setShowMissingInfoAlert(true);
        return;
      }

      try {
        const response: AxiosResponse = await axios.post(
          "http://beejobs.io.vn:14307/api/signup",
          {
            accout_name: accout_name,
            email: email,
            passwd: passwd,
            type_role: "NLD",
            verify: false,
          }
        );
        if (response.data.status === 200){
          router.push({ pathname: "VerifyAccount", params: { email: email } });
        }
        else if(response.data.status === 400){
          setMessage("Email đã được đăng ký!");
          setShowMissingInfoAlert(true);
          setColor("red");
          return;
        }
        
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        setMessage("Đăng ký thất bại");
        setShowMissingInfoAlert(true);
        setColor("red");
      }finally {
        setLoading(false); // Kết thúc loading
      }
    }
  };

  const handleFeatureInDevelopment = () => {
    Alert.alert("Thông báo", "Tính năng đang phát triển");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Họ và Tên"
          value={accout_name}
          onChangeText={setName}
        />
      </View>
      {errors.accout_name ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={20} color="red" />
          <Text style={styles.errorText}>{errors.accout_name}</Text>
        </View>
      ) : null}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      {errors.email ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={20} color="red" />
          <Text style={styles.errorText}>{errors.email}</Text>
        </View>
      ) : null}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={passwd}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#A9A9A9"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {errors.passwd ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={20} color="red" />
          <Text style={styles.errorText}>{errors.passwd}</Text>
        </View>
      ) : null}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry={!showPassword2}
          value={passwd2}
          onChangeText={setPassword2}
        />
        <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}>
          <Icon
            name={showPassword2 ? "eye" : "eye-slash"}
            size={20}
            color="#A9A9A9"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {errors.passwd2 ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={20} color="red" />
          <Text style={styles.errorText}>{errors.passwd2}</Text>
        </View>
      ) : null}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
      )}
      <Text style={styles.continueWithText}>----- continue with -----</Text>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity onPress={handleFeatureInDevelopment}>
          <Ionicons name="logo-facebook" size={35} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFeatureInDevelopment}>
          <Ionicons name="logo-google" size={35} color="#db4a39" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFeatureInDevelopment}>
          <Ionicons name="logo-twitter" size={35} color="#00acee" />
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        Bạn đã có tài khoản?
        <Text
          style={styles.signinText}
          onPress={() => router.push("LoginScreen")}
        >
          {" "}
          Đăng nhập
        </Text>
      </Text>
      <AlertComponent
        color={color}
        message={message}
        visible={showMissingInfoAlert}
        onClose={() => setShowMissingInfoAlert(false)}
      />
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 25,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  icon: {
    marginRight: 10,
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
  continueWithText: {
    textAlign: "center",
    color: "#A9A9A9",
    marginBottom: 20,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  footerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#A9A9A9",
  },
  signinText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  rememberMeCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
  },
  rememberMeCheckboxChecked: {
    backgroundColor: "#007aff",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    marginTop: 10,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default RegisterScreen;
