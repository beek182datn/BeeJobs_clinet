import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import axios, { AxiosResponse } from "axios";
import * as ImagePicker from "expo-image-picker";
type SetterFunction = (uri: string) => void;
import { User, Worker } from "../../components/Model/Model";
import { getUserInfo, findWorkerById } from "@/components/fetch_data/api";
import { Ionicons } from "@expo/vector-icons";

const pickImage = async (setter: SetterFunction) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access media library is required!');
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
  const [worker_avatar, setWorker_avatar] = useState(workerinfo.worker_avatar);
  const [worker_avatars, setWorker_avatars] = useState<string | null>(null);
  //const user_id = params.id_user;
  const [phone, setPhone] = useState(workerinfo.phone);
  const [email, setEmail] = useState(workerinfo.email);
  //console.log(user_id);
  const [errors, setErrors] = useState({
    worker_name: "",
    worker_avatar: "",
    email: "",
    phone: "",
  });

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

    fetchUserInfo();
    
  }, []);

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
    if(noErrors){
      router.push('/Profile');
    }
  };
  const handleRegister = async (): Promise<void> => {
    
    try {
      const avatarUrl = worker_avatar;
      if (avatarUrl) {
        const formData = new FormData();
        formData.append('worker_name', String(worker_name));
        //formData.append('worker_avatar', worker_avatars as any);
        formData.append('email', String(email));  // Replace with actual email
        formData.append('phone', String(phone));
        if (worker_avatars) {
          const response = await fetch(worker_avatars);
          const blob = await response.blob();
          formData.append('worker_avatar', {
            uri: worker_avatars,
            type: blob.type,
            name: 'logo.jpg',
          }as any);
        }
        //console.log(JSON.stringify(`http://beejobs.io.vn:14307/workers/update/${String(worker?.user_id)}`));
        if(worker){
          const response: AxiosResponse = await axios.post(
            `http://beejobs.io.vn:14307/workers/update/${workerinfo.user_id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          
          
        }
        
      } else {
        console.error('Failed to upload image, registration aborted.');
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
    }
    handleContinue();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={router.back}
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

        <TouchableOpacity style={styles.saveButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
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
    borderColor: 'blue',
    borderWidth: 2
  },
});

export default CompleteProfileScreen2;
