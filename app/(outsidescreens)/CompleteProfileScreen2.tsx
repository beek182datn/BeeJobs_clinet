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
  
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import axios, { AxiosResponse } from "axios";
import * as ImagePicker from "expo-image-picker";
import AlertComponent from "@/components/AlertComponent";
type SetterFunction = (uri: string) => void;
import { User, Worker } from "../../components/Model/Model";
import { getUserInfo, findWorkerById } from "@/components/fetch_data/api";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

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
    quality: 0.2,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setter(result.assets[0].uri);
  }
};

const CompleteProfileScreen2: React.FC = () => {
  const router = useRouter();
  const workerinfo = useLocalSearchParams();
  //console.log(JSON.stringify(String(workerinfo.user_id)))
  const [user, setUser] = useState<User | null>();
  const [worker, setWorker] = useState<Worker | null>();
  const [worker_name, setWorker_name] = useState(workerinfo.worker_name);
  const [major, setMajor] = useState(workerinfo.major);
  const [experience, setExperience] = useState(workerinfo.experience);
  const [worker_avatar, setWorker_avatar] = useState(workerinfo.worker_avatar);
  const [worker_avatars, setWorker_avatars] = useState<string | null>(null);
  //const user_id = params.id_user;
  const [phone, setPhone] = useState(workerinfo.phone);
  const [email, setEmail] = useState(workerinfo.email);
  const [address, setAddress] = useState(workerinfo.address);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [showMissingInfoAlert, setShowMissingInfoAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

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
    const fetchUserInfo = async () => {
      try {
        // const emailValue = await AsyncStorage.getItem('userProfile');
        // console.log(emailValue)
        const user: User | null = await getUserInfo();
        setUser(user);
        if (user) {
          const worker = await findWorkerById(user.id_user);
          //console.log(user.id_user);
          setWorker(worker);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    fetchUserInfo();
    return () => backHandler.remove();
  }, []);

  const handleContinue = () => {
    // sau khi hoàn thành thì cho vào màn Home
    const newErrors = {
      worker_name: worker_name ? "" : "Tên không được để trống",
      worker_avatar: worker_avatar ? "" : "Ảnh đại diện không được bỏ trống",
      email: email ? "" : "Địa chỉ Gmail không được để trống",
      phone: phone ? "" : "Số điện thoại không được để trống",
      major: major ? "" : "Ngành không được để trống",
      experience: experience ? "" : "Kinh nghiệm không được để trống",
      address: address ? "" : "Địa chỉ không được để trống",
    };

    // Kiểm tra số điện thoại
    if (phone && !isValidPhoneNumber(String(phone))) {
      //newErrors.phone = "Số điện thoại phải có 10 số & không có chữ cái";
      return ;
    }

    setErrors(newErrors);

    const noErrors = Object.values(newErrors).every((error) => !error);
    if (noErrors) {
      router.push("/Profile");
    }
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    // Kiểm tra số ký tự có đúng 10 ký tự không
    if (phone.length !== 10) {
      setMessage("Số điện thoại phải đủ 10 số");
      setColor("red");
      setShowMissingInfoAlert(true);
      return false;
    }

    // Kiểm tra xem có chứa chữ cái không
    const regexPhone = /^[0-9]{10}$/;
    if (!regexPhone.test(phone)) {
      setMessage("Số điện thoại không chứ chữ cái");
      setColor("red");
      setShowMissingInfoAlert(true);
      return false;
    }

    return true;
  };

  const handleRegister = async (): Promise<void> => {
    handleContinue();
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
        formData.append("worker_name", String(worker_name));
        // if (worker_avatar !== workerinfo.worker_avatar) {
        //   formData.append('worker_avatar', avatarUrl);
        // }
        formData.append("email", String(email)); // Replace with actual email
        formData.append("phone", String(phone));
        formData.append("major", String(major));
        formData.append("experience", String(experience));
        formData.append("address", String(address));
        if (worker_avatars) {
          const response = await fetch(worker_avatars);
          const blob = await response.blob();
          formData.append("worker_avatar", {
            uri: worker_avatars,
            type: blob.type,
            name: "logo.jpg",
          } as any);
        }
        //console.log(JSON.stringify(`http://beejobs.io.vn:14307/workers/update/${String(worker?.user_id)}`));
        if (worker) {
          const response: AxiosResponse = await axios.post(
            `http://beejobs.io.vn:14307/workers/update/${workerinfo.user_id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }
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
          <Text style={styles.header}>Thay đổi thông tin của bạn</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>

        <Text style={styles.sectionHeader}>Thông tin cá nhân</Text>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => pickImage(setWorker_avatars)}>
            <Image
              source={{
                uri: !worker_avatars
                  ? `http://beejobs.io.vn:14307${workerinfo.worker_avatar}`
                  : worker_avatars,
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
              value={String(worker_name)}
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
              value={String(email)}
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
              value={String(phone)}
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
              value={String(major)}
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
      <AlertComponent
        color={color}
        message={message}
        visible={showMissingInfoAlert}
        onClose={() => setShowMissingInfoAlert(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
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

export default CompleteProfileScreen2;
