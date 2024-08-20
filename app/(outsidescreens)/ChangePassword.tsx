import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Thêm thư viện cho icon (nếu sử dụng)
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePassword = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user_id = params.id_user;
  const userinfo = useLocalSearchParams();
  //const token = params.token;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [saveToken, setsaveToken] = useState("");

  const backAction = () => {
    router.back();
    return true;
  };

  useEffect(() => {
    getToken();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token !== null) {
        console.log("Token đã được truy xuất:", token);
        setsaveToken(token);
        return token;
      } else {
        console.log("Không tìm thấy token");
        return null;
      }
    } catch (error) {
      console.log("Có lỗi xảy ra khi truy xuất token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //console.log(`Fetching data for user ID: ${user_id}`);
        const response = await axios.get(
          `http://beejobs.io.vn:14307/user/${user_id}`
        );
        const userData = response.data.user;
        console.log(userData);
        if (userData && userData.email) {
          setEmail(userData.email);
        } else {
          console.error("Email not found in user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user_id]);

  const handleSave = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    const url = `http://beejobs.io.vn:14307/api/changepassword/${user_id}`;

    try {
      const response = await axios.post(url, {
        newPassword: newPassword,
        currentPassword: currentPassword,
      });

      if (response.data.status === 200) {
        Alert.alert("Thông báo", "Đổi mật khẩu thành công");
        router.replace("Profile");
      } else if (response.data.status === 400) {
        Alert.alert("Lỗi", "Mật khẩu cũ không đúng");
        return;
      } else {
        Alert.alert("Lỗi", "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* <Icon name="arrow-left" size={20} color="#000" onPress={router.back} /> */}
          <TouchableOpacity
            onPress={backAction}
            style={{ backgroundColor: "#2196F3", borderRadius: 30, padding: 5 }}
          >
            <Ionicons name="arrow-back" size={22} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Email đăng nhập</Text>
          <TextInput
            style={styles.inputemail}
            value={String(email)}
            editable={false}
          />

          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu hiện tại"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonCancel} onPress={router.back}>
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
            <Text style={styles.buttonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    position: "relative",
    //paddingTop: 20
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingTop: 25
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  form: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
  },
  inputemail: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
    color: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonCancel: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ccc",
    borderRadius: 4,
    marginRight: 8,
  },
  buttonSave: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChangePassword;
