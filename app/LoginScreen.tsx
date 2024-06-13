import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "expo-router";
import { BackHandler, Alert } from "react-native";
import AlertComponent from "@/components/AlertComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [passwd, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Thông báo !", "Bạn muốn thoát khỏi ứng dụng?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const loadCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("username");
        const savedPassword = await AsyncStorage.getItem("passwd");
        if (savedUsername && savedPassword) {
          setUsername(savedUsername);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Không tải được thông tin đăng nhập", error);
      }
    };
    loadCredentials();
    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    if (username.trim() === "" || passwd.trim() === "") {
      setMessage("Hãy nhập đầy đủ thông tin");
      setColor("red");
      setShowAlert(true);
      return;
    }

    if (rememberMe) {
      try {
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("passwd", passwd);
      } catch (error) {
        console.error("Không lưu được thông tin đăng nhập", error);
      }
    } else {
      try {
        await AsyncStorage.removeItem("username");
        await AsyncStorage.removeItem("passwd");
      } catch (error) {
        console.error("Không xóa được thông tin đăng nhập", error);
      }
    }

    try {
      const response = await axios.post(
        "http://beejobs.io.vn:14307/api/login",
        {
          username: username,
          passwd: passwd,
        }
      );

      // Kiểm tra phản hồi từ API
      if (response.data.status === 200) {
        console.log("Đăng nhập thành công:", response.data);
        setLoggedInUser(response.data.user_info.email);

        // Reset form fields
        setUsername("");
        setPassword("");
        setShowPassword(false);
        setRememberMe(false);
        setMessage("Đăng nhập thành công");
        setColor("green");
        setShowAlert(true);

        // Chuyển hướng đến màn hình khác sau khi đăng nhập thành công
        router.push("/Home");

        // if (response.data.user_info && response.data.user_info.email) {

        // } else {
        //   alert("Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.");
        // }
      } else if (response.data.status === 400) {
        setMessage("Thông tin đăng nhập không chính xác");
        setColor("red");
        setShowAlert(true);
      } else {
        alert("Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      // if (error.response && error.response.status === 401) {
      //   alert("Thông tin đăng nhập không chính xác. Vui lòng thử lại.");
      // } else {
      //   alert("Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau.");
      // }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tài khoản hoặc Email"
          value={username}
          onChangeText={setUsername}
        />
      </View>
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
            name={showPassword ? "eye-slash" : "eye"}
            size={20}
            color="#A9A9A9"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => router.push("ForgotPasswordScreen")}
      >
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity
          style={[
            styles.rememberMeCheckbox,
            rememberMe ? styles.rememberMeCheckboxChecked : null,
          ]}
          onPress={() => setRememberMe(!rememberMe)}
        />
        <Text style={styles.rememberMeText}>Lưu mật khẩu</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <Text style={styles.continueWithText}>----- continue with -----</Text>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity>
          <Icon name="facebook-square" size={35} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="google-plus-square" size={35} color="#db4a39" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="twitter-square" size={35} color="#00acee" />
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        Bạn chưa có tài khoản?
        <Text
          style={styles.signupText}
          onPress={() => router.push("RegisterScreen")}
        >
          {" "}
          Đăng ký
        </Text>
      </Text>
      <AlertComponent
        color={color}
        message={message}
        visible={showAlert}
        onClose={() => setShowAlert(false)}
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
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: 16,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 10,
  },
  rememberMeText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
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
    marginBottom: 30,
  },
  signupText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default LoginScreen;
