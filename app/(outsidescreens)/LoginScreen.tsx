import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBackHandler } from "../../components/BackHandler";
import AlertComponent from "@/components/AlertComponent";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [passwd, setPassword] = useState("");
  const [userID, setuserID] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [backPressCount, setBackPressCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showAlert, setShowAlert, message, setMessage, color, setColor } =
    useBackHandler(true);

  const [errors, setErrors] = useState({
    username: "",
    passwd: "",
  });

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount === 0) {
        setBackPressCount(1);
        ToastAndroid.show("Chạm lần nữa để thoát", ToastAndroid.SHORT);
        setTimeout(() => {
          setBackPressCount(0);
        }, 2000);

        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [backPressCount]);

  const handleLogin = async () => {
    const newErrors = {
      username: username ? "" : "Cho chúng tôi biết email của bạn",
      passwd: passwd ? "" : "Mật khẩu không được trống",
    };

    setErrors(newErrors);

    const noErrors = Object.values(newErrors).every((error) => !error);
    if (noErrors) {
      setLoading(true); // Bắt đầu loading
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
        const userId = response.data.user_info.id_user
        await AsyncStorage.setItem("userID", userId);
        console.log('log ra id: ' +userId);

        if (response.data.status === 200) {
          setLoggedInUser(response.data.user_info.email);
          try {
            await AsyncStorage.setItem(
              "userProfile",
              JSON.stringify(response.data)
            );
            await AsyncStorage.setItem(
              "user_info",
              JSON.stringify(response.data.user_info)
            );

            await AsyncStorage.setItem(
              "token",
              JSON.stringify(response.data.token)
            );
          } catch (error) {
            console.error("Error saving user profile:", error);
          }
          router.push("/Home");
        } else if (response.data.status === 400) {
          setMessage("Thông tin đăng nhập không chính xác!");
          setColor("#FF0000");
          setShowAlert(true);
        } else {
          setMessage("Email đăng nhập không tồn tại");
          setColor("#FF0000");
          setShowAlert(true);
        }
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    }
  };

  const handleFeatureInDevelopment = () => {
    Alert.alert("Thông báo", "Tính năng đang phát triển");
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
      {errors.username ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={20} color="red" />
          <Text style={styles.errorText}>{errors.username}</Text>
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
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => router.push("/ForgotPasswordScreen")}
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
        >
          {rememberMe && <Icon name="check" size={15} color="#fff" />}
        </TouchableOpacity>
        <Text style={styles.rememberMeText}>Lưu mật khẩu</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
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
        Bạn chưa có tài khoản?
        <Text
          style={styles.signupText}
          onPress={() => router.push("RegisterScreen")}
        >
          {" "}
          Đăng ký
        </Text>
      </Text>
      <Text
          style={{textAlign: 'center', color: "#007BFF", fontWeight:'bold', fontSize: 16}}
          onPress={() => router.push("/Home")}
        >
          {" "}
          Trải nghiệm không cần đăng nhập
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
    justifyContent: "center",
    alignItems: "center",
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

export default LoginScreen;
