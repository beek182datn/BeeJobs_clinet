import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AlertComponent from "@/components/AlertComponent";
import axios, { AxiosResponse } from "axios";
// import CheckBox from '@react-native-community/checkbox';

const RegisterScreen = () => {
  const [accout_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwd, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  //const types = ['worker', 'company'];
  const [userType, setUserType] = useState("worker"); // default to 'worker'

  const handleRegister = async () => {
    const type = userType === 'worker' ? 'NLD' : 'DN';
    if (accout_name.trim() === "" || email.trim() === "" || passwd.trim() === "") {
      alert("Xin vui lòng điền đầy đủ vào những ô trống cần thiết.");
      return;
    }
  
    try {
      const response: AxiosResponse = await axios.post('http://beejobs.io.vn:14307/api/signup', {
        accout_name: accout_name,
        email: email,
        passwd: passwd,
        type: type,
      });
      console.log('Đăng ký thành công:', response.data);
  
      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setRememberMe(false);
      setUserType("worker");
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Jordan"
          value={accout_name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Jordan.domain.com"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#A9A9A9" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
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
      <View style={styles.radioButtonContainer}>
        <View style={styles.radioButtonRow}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setUserType("worker")}
          >
            <View
              style={[
                styles.radioButtonInner,
                userType === "worker" ? styles.radioButtonInnerSelected : null,
              ]}
            />
          </TouchableOpacity>
          <Text style={styles.radioButtonText}>Worker</Text>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setUserType("company")}
          >
            <View
              style={[
                styles.radioButtonInner,
                userType === "company" ? styles.radioButtonInnerSelected : null,
              ]}
            />
          </TouchableOpacity>
          <Text style={styles.radioButtonText}>Company</Text>
        </View>
      </View>
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity
          style={[
            styles.rememberMeCheckbox,
            rememberMe ? styles.rememberMeCheckboxChecked : null,
          ]}
          onPress={() => setRememberMe(!rememberMe)}
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign up</Text>
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
        Already have an account?
        <Text style={styles.signinText}> Signin</Text>
      </Text>
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
  radioButtonContainer: {
    marginBottom: 20,
    alignItems: 'center'
  },
  radioButtonLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioButtonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007aff",
    borderRadius: 12,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  radioButtonInnerSelected: {
    backgroundColor: "#007aff",
  },
  radioButtonText: {
    fontSize: 16,
    marginRight: 20,
  },
});

export default RegisterScreen;
