import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  BackHandler
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import axios, { AxiosResponse } from "axios";
import * as ImagePicker from "expo-image-picker";
type SetterFunction = (uri: string) => void;

const pickImage = async (setter: SetterFunction) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Permission to access media library is required!");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setter(result.assets[0].uri);
  }
};

const CompleteProfileScreen1: React.FC = () => {
  const router = useRouter();
  const [worker_name, setWorker_name] = useState("");
  const [worker_avatar, setWorker_avatar] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const user_id = params.id_user;
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  //console.log(user_id);
  const [errors, setErrors] = useState({
    worker_name: "",
    worker_avatar: "",
    email: "",
    phone: "",
  });
  const backAction = () => {
    router.back();
    return true;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //console.log(`Fetching data for user ID: ${user_id}`);
        const response = await axios.get(
          `http://beejobs.io.vn:14307/user/${user_id}`
        );
        const userData = response.data.user;
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
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();

  }, [user_id]);

  const handleContinue = () => {
    // sau khi hoàn thành thì cho vào màn Home
    const newErrors = {
      worker_name: worker_name ? "" : "Tên không được để trống",
      worker_avatar: worker_avatar ? "" : "Ảnh đại diện không được bỏ trống",
      email: email ? "" : "Địa chỉ Gmail không được để trống",
      phone: phone ? "" : "Số điện thoại không được để trống",
    };

    setErrors(newErrors);
    const noErrors = Object.values(newErrors).every((error) => !error);
    if (!noErrors) {
      return;
    }
  };

  const handleRegister = async (): Promise<void> => {
    handleContinue();
    try {
      const avatarUrl = worker_avatar;
      if (avatarUrl) {
        const formData = new FormData();
        formData.append("worker_name", worker_name);
        formData.append("worker_avatar", avatarUrl);
        formData.append("email", email); // Replace with actual email
        formData.append("phone", phone);
        if (worker_avatar) {
          try {
            const response = await fetch(worker_avatar);
            const blob = await response.blob();
            formData.append("worker_avatar", {
              uri: worker_avatar,
              type: blob.type,
              name: "logo.jpg",
            } as any);
          } catch (err) {
            console.error("Lỗi khi tải ảnh:");
            return; // Ngừng thực hiện nếu có lỗi khi tải ảnh
          }
        }

        const response: AxiosResponse = await axios.post(
          `http://beejobs.io.vn:14307/workers/create/${user_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        router.push("/Profile");
      } else {
        console.error("Failed to upload image, registration aborted.");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Icon
            name="arrow-left"
            size={20}
            color="#000"
            onPress={backAction}
          />
          <Text style={styles.header}>Thiết lập hồ sơ của bạn</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>

        <Text style={styles.sectionHeader}>Thông tin cá nhân</Text>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => pickImage(setWorker_avatar)}>
            <Image
              source={{
                uri: worker_avatar
                  ? worker_avatar
                  : "https://via.placeholder.com/100",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#A9A9A9" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Tên"
              value={worker_name}
              onChangeText={setWorker_name}
            />
          </View>
          {errors.worker_name ? (
            <Text style={styles.errorText}>{errors.worker_name}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            <Icon
              name="envelope"
              size={20}
              color="#A9A9A9"
              style={styles.icon}
            />
            <TextInput
              style={styles.inputemail}
              placeholder="Gmail"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={false}
            />
          </View>
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionHeader}>Số điện thoại</Text>
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#A9A9A9" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              // keyboardType="numeric"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          {errors.phone ? (
            <Text style={styles.errorText}>{errors.phone}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginBottom: 20,
  },
  progress: {
    height: "100%",
    width: "100%",
    backgroundColor: "#6200EE",
    borderRadius: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  inputemail: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#ccc",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  icon: {
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  skipText: {
    color: "#6200EE",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 10,
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 50,
    marginBottom: 10,
    borderColor: "blue",
    borderWidth: 2,
  },
});

export default CompleteProfileScreen1;
