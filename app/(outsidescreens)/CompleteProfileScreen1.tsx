import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';

const CompleteProfileScreen1: React.FC = () => {
  const router = useRouter();
  
  const [userData, setUserData] = useState(null);
  const [worker_name, setWorker_name] = useState("");
  const [worker_avatar, setWorker_avatar] = useState("");
  const params = useLocalSearchParams();
  const email = params.email;
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  console.log(email)
  //thêm user_id vào
  const [errors, setErrors] = useState({
    worker_name: "",
    worker_avatar: "",
    email: "",
    phone: ""
  });

  const handleContinue = () => {
    // sau khi hoàn thành thì cho vào màn Home
    const newErrors = {
      worker_name: worker_name ? "" : "Tên không được để trống",
      worker_avatar: worker_avatar ? "" : "Ảnh đại diện không được bỏ trống",
      email: email ? "" : "Địa chỉ Gmail không được để trống",
      phone: phone ? "": "Số điện thoại không được để trống"
    };

    setErrors(newErrors);

    const noErrors = Object.values(newErrors).every(error => !error);

    if (noErrors) {
      router.push("/Home");
    }
  };

  const skipnow = () => {
    router.push("/Home");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Icon
            name="arrow-left"
            size={20}
            color="#000"
            onPress={router.back}
          />
          <Text style={styles.header}>Thiết lập hồ sơ của bạn</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>

        <Text style={styles.sectionHeader}>Thông tin cá nhân</Text>
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
              style={styles.input}
              placeholder="Địa chỉ Gmail"
              keyboardType="email-address"
              // value={email}
              // onChangeText={setEmail}
            />
          </View>
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            <Icon
              name="image"
              size={20}
              color="#A9A9A9"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Ảnh đại diện"
              
              value={worker_avatar}
              onChangeText={setWorker_avatar}
            />
          </View>
          {errors.worker_avatar ? (
            <Text style={styles.errorText}>{errors.worker_avatar}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionHeader}>Số điện thoại</Text>
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Icon
              name="phone"
              size={20}
              color="#A9A9A9"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={address}
              onChangeText={setAddress}
            />
          </View>
          {errors.phone ? (
            <Text style={styles.errorText}>{errors.phone}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>Lưu</Text>
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
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 10
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
});

export default CompleteProfileScreen1;
