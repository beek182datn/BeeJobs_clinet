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
  BackHandler,
  ToastAndroid,
  StatusBar,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import axios, { AxiosResponse } from "axios";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [major, setMajor] = useState("");
  const [experience, setExperience] = useState("");
  const [address, setAddress] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);

  //console.log(user_id);
  const [errors, setErrors] = useState({
    worker_name: "",
    worker_avatar: "",
    email: "",
    phone: "",
    major: "",
    experience: "",
    address: "",
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

  const handleContinue = (): boolean => {
    // Kiểm tra lỗi và trả về true nếu không có lỗi
    const newErrors = {
      worker_name: worker_name
        ? (/^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểẾỄỆỈỊọỏốồổỗộớờởỡợỤỦỨỪễệỉịỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪửữựỳỵỷỹ\s]{1,50}$/
.test(worker_name)
          ? ""
          : "Tên không được chứa ký tự số và phải dưới 50 ký tự")
        : "Tên không được để trống",
      worker_avatar: worker_avatar ? "" : "Ảnh đại diện không được bỏ trống",
      email: email ? "" : "Địa chỉ Gmail không được để trống",
      phone: phone
        ? (/^\d{10}$/.test(String(phone))
          ? ""
          : "Số điện thoại phải đủ 10 chữ số và không có ký tự chữ")
        : "Số điện thoại không được để trống",
      major: major ? "" : "Ngành không được để trống",
      experience: experience ? "" : "Kinh nghiệm không được để trống",
      address: address ? "" : "Địa chỉ không được để trống",
    };
  
    setErrors(newErrors);
  
    const noErrors = Object.values(newErrors).every((error) => !error);
    return noErrors; // Trả về true nếu không có lỗi
  };
  
  const handleRegister = async (): Promise<void> => {
    const noErrors = handleContinue(); // Kiểm tra lỗi
  
    // Nếu có lỗi thì dừng quá trình đăng ký
    if (!noErrors) {
      return;
    }
  
    try {
      const avatarUrl = worker_avatar;
      if (
        avatarUrl &&
        worker_name &&
        phone &&
        major &&
        experience !== "" &&
        address
      ) {
        const formData = new FormData();
        formData.append("worker_name", worker_name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("major", major);
        formData.append("experience", experience);
        formData.append("address", address);
  
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
            console.error("Lỗi khi tải ảnh:", err);
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

        const dataWorker = await AsyncStorage.getItem('workerData');
        if(dataWorker){
          router.back()
        }else{
          router.push("/Profile"); // Chuyển hướng sau khi thành công
        }
      } else {
        console.log("Ảnh chưa được chọn hoặc dữ liệu không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={backAction}
            style={{ backgroundColor: "#2196F3", borderRadius: 30, padding: 5 }}
          >
            <Ionicons name="arrow-back" size={22} color="black" />
          </TouchableOpacity>
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
          {errors.worker_avatar ? (
            <Text style={styles.errorText}>{errors.worker_avatar}</Text>
          ) : null}
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

        <Text style={styles.sectionHeader}>Địa chỉ</Text>
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Icon name="home" size={20} color="#A9A9A9" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={String(address)}
              onChangeText={setAddress}
            />
          </View>
          {errors.address ? (
            <Text style={styles.errorText}>{errors.address}</Text>
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

        <Text style={styles.sectionHeader}>Chuyên ngành</Text>
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Icon
              name="briefcase"
              size={20}
              color="#A9A9A9"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Chuyên ngành"
              // keyboardType="numeric"
              value={major}
              onChangeText={setMajor}
            />
          </View>
          {errors.major ? (
            <Text style={styles.errorText}>{errors.major}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionHeader}>Kinh nghiệm</Text>
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Icon name="star" size={20} color="#A9A9A9" style={styles.icon} />
            <Picker
              selectedValue={experience}
              onValueChange={(itemValue) => {
                setExperience(itemValue);
                setPickerVisible(false); // Đóng picker sau khi chọn
              }}
              style={styles.input}
            >
              <Picker.Item label="-Kinh nghiệm-" value="" />
              <Picker.Item label="Sắp đi làm" value="Sắp đi làm" />
              <Picker.Item label="Dưới 1 năm" value="Dưới 1 năm" />
              <Picker.Item label="1 năm" value="1 năm" />
              <Picker.Item label="2 năm" value="2 năm" />
              <Picker.Item label="3 năm" value="3 năm" />
              <Picker.Item label="4 năm" value="4 năm" />
              <Picker.Item label="5 năm" value="5 năm" />
              <Picker.Item label="Trên 5 năm" value="Trên 5 năm" />
            </Picker>
          </View>
          {errors.experience ? (
            <Text style={styles.errorText}>{errors.experience}</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
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
    marginBottom: 0,
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
