import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  SafeAreaView,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
//import ActionSheet from "react-native-actionsheet";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";
import { Company, User, Worker, AppliedJob, Job } from "../../components/Model/Model";
import { getUserInfo, findWorkerById, getAppliedJobsByWorker, getFollowedJobs } from "@/components/fetch_data/api";
import * as ImagePicker from "expo-image-picker";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import JobDetail from "../(insidescreens)/JobDetail";

type SetterFunction = (uri: string) => void;

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
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setter(result.assets[0].uri);
  }
};

const Profile: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();
  const [worker, setWorker] = useState<Worker | null>();
  //console.log(worker);
  const [worker_avatars, setWorker_avatars] = useState<string | null>(null);
  const [companyInfo, setCompanyInfo] = useState<Company[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

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
          try {
            const jobsFollowed = await getFollowedJobs(user.id_user);
            setJobs(jobsFollowed);
            console.log('long: ', JSON.stringify(jobsFollowed))
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
    fetchData();
    fetchDataApplide();
  }, [router]);

  const fetchDataApplide = async () => {
    try {
      const user: User | null = await getUserInfo();
      setUser(user);

      if (user) {
        var jobsLastWeek = await getAppliedJobsByWorker(user.id_user);
        setAppliedJobs(jobsLastWeek);
        console.log(JSON.stringify(jobsLastWeek))
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userID");
      if (userId) {
        const response = await axios.get(
          `http://beejobs.io.vn:14307/api/findcompanys/${userId}`
        );
        setCompanyInfo(response.data);
        console.log(response.data);
      } else {
        console.log("No UserID found in AsyncStorage");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 404) {
          //console.warn("User not found");
          // Xử lý khi không tìm thấy user trong cơ sở dữ liệu
        } else {
          console.error("Error fetching user data:", err.message);
          // Xử lý các lỗi khác
        }
      } else {
        console.error("Unexpected error:", err);
        // Xử lý các lỗi không phải của Axios
      }
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user_info');
              await AsyncStorage.removeItem('userProfile');
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('userID');
              console.log(`Removed item with key: userId`);
              router.push("/LoginScreen");
            } catch (error) {
              console.error("Error removing item from AsyncStorage: ", error);
            }

          },
        },
      ],
      { cancelable: false }
    );
  };

  const goCreate = () => {
    if (user) {
      router.push({
        pathname: "CompleteProfileScreen1",
        params: { id_user: user.id_user },
      });
    }
  };

  const goUpdate = () => {
    if (worker) {
      router.push({
        pathname: "CompleteProfileScreen2",
        params: worker,
      });
    }
  };

  const goChangepasswd = () => {
    router.push({
      pathname: "ChangePassword",
      params: { id_user: user?.id_user }
    });

  };

  const showActionSheet = () => {
    handleActionSheetPress;
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      fetchDataApplide();
    }, [])
  );

  const handleActionSheetPress = () => {
    DocumentPicker.getDocumentAsync({
      type: "*/*", // Allow any file type, you can specify MIME types if needed
      copyToCacheDirectory: true,
    }).then((response) => {
      if (2 > 0) {
        console.log("Selected file: ", response);
        // Process the selected file here
      } else {
        console.log("User cancelled the picker");
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      {user && !worker &&(
        <>
        <View style={styles.profileHeader}>
            <TouchableOpacity>
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>Bạn chưa cập nhật hồ sơ</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.upgradeButton} onPress={goCreate}>
                  <Text style={styles.upgradeText}>Cập nhật</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.jobManagement}>
            <Text style={styles.managementTitle}>Quản lý tìm việc</Text>
            <View style={styles.row}>
              <View style={styles.managementBox}>
                <Ionicons name="briefcase" size={30} color="#0099CC" />
                <Text style={styles.managementText}>Việc làm đã ứng tuyển</Text>
                <Text style={styles.infoNumber}>0</Text>
              </View>
              <View style={styles.managementBox}>
                <Ionicons name="bookmark" size={30} color="#0099CC" />
                <Text style={styles.managementText}>Việc làm đã lưu</Text>
                <Text style={styles.infoNumber}>0</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.infoBox}>
                <Ionicons name="eye" size={30} color="#0099CC" />
                <Text style={styles.infoText}>NTD đã xem hồ sơ</Text>
                <Text style={styles.infoNumber}>0</Text>
              </View>
              <View style={styles.infoBox} >
                <Ionicons name="business" size={30} color="#0099CC" />
                <Text style={styles.infoText}>Công ty đang theo dõi</Text>
                <Text style={styles.infoNumber}>0</Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.accountSettingsTitle}>Thông tin dịch vụ</Text>
            <TouchableOpacity style={styles.utilityItem}>
              <Ionicons name="business" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Về BeeJobs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.utilityItem}

            >
              <Ionicons name="document-text" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Điều khoản dịch vụ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.utilityItem}>
              <Ionicons name="document-lock" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Chính sách bảo mật</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.utilityItem}>
              <Ionicons name="call-outline" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Trợ giúp</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
          >
            <Text style={styles.logoutText}>Đăng xuất</Text>
            <Ionicons name="log-out-outline" size={20} color="#333" />
          </TouchableOpacity>
        </>
      )}
      {worker && user &&(
        <>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={() => pickImage(setWorker_avatars)}>
              <Image
                source={{
                  uri: !worker_avatars
                    ? `http://beejobs.io.vn:14307${worker.worker_avatar}`
                    : worker_avatars,
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{worker?.worker_name}</Text>
              <Text style={styles.candidateId}>{worker?.email}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.upgradeButton}>
                  <Text style={styles.upgradeText}>Nâng cấp tài khoản</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.jobManagement}>
            <Text style={styles.managementTitle}>Quản lý tìm việc</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.managementBox} onPress={() => { router.push('(insidescreens)/AppliedJobByTime') }}>
                <Ionicons name="briefcase" size={30} color="#0099CC" />
                <Text style={styles.managementText}>Việc làm đã ứng tuyển</Text>
                <Text style={styles.infoNumber}>{appliedJobs.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.managementBox} onPress={() => {
                router.push('(insidescreens)/JobsFollowed');
              }}>
                <Ionicons name="bookmark" size={30} color="#0099CC" />
                <Text style={styles.managementText}>Việc làm đã lưu</Text>
                <Text style={styles.infoNumber}>{jobs.length}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.infoBox}>
                <Ionicons name="eye" size={30} color="#0099CC" />
                <Text style={styles.infoText}>NTD đã xem hồ sơ</Text>
                <Text style={styles.infoNumber}>0</Text>
              </View>
              <TouchableOpacity style={styles.infoBox} onPress={() => { router.push('/FollowCompany') }}>
                <Ionicons name="business" size={30} color="#0099CC" />
                <Text style={styles.infoText}>Công ty đang theo dõi</Text>
                <Text style={styles.infoNumber}>{companyInfo.length}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.accountSettingsTitle}>Cài đặt tài khoản</Text>
            <TouchableOpacity style={styles.utilityItem} onPress={goUpdate}>
              <Ionicons name="albums" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Thay đổi thông tin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.utilityItem}
              onPress={goChangepasswd}
            >
              <Ionicons name="key" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Đổi mật khẩu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.utilityItem}>
              <Ionicons name="lock-closed" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Vô hiệu hóa tài khoản</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.accountSettingsTitle}>Thông tin dịch vụ</Text>
            <TouchableOpacity style={styles.utilityItem}>
              <Ionicons name="business" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Về BeeJobs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.utilityItem}

            >
              <Ionicons name="document-text" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Điều khoản dịch vụ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.utilityItem}>
              <Ionicons name="document-lock" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Chính sách bảo mật</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.utilityItem}>
              <Ionicons name="call-outline" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Trợ giúp</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
          >
            <Text style={styles.logoutText}>Đăng xuất</Text>
            <Ionicons name="log-out-outline" size={20} color="#333" />
          </TouchableOpacity>
        </>
      )}
      {!user &&(
        <>
          <View style={styles.profileHeader}>
            <TouchableOpacity>
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>Vui lòng đăng nhập</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.upgradeButton} onPress={()=>{router.push('/LoginScreen')}}>
                  <Text style={styles.upgradeText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.jobManagement}>
            <Text style={styles.managementTitle}>Quản lý tìm việc</Text>
            <View style={styles.row}>
              <View style={styles.managementBox}>
                <Ionicons name="briefcase" size={30} color="#0099CC" />
                <Text style={styles.managementText}>Việc làm đã ứng tuyển</Text>
                <Text style={styles.infoNumber}>0</Text>
              </View>
              <View style={styles.managementBox}>
                <Ionicons name="bookmark" size={30} color="#0099CC" />
                <Text style={styles.managementText}>Việc làm đã lưu</Text>
                <Text style={styles.infoNumber}>0</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.infoBox}>
                <Ionicons name="eye" size={30} color="#0099CC" />
                <Text style={styles.infoText}>NTD đã xem hồ sơ</Text>
                <Text style={styles.infoNumber}>0</Text>
              </View>
              <View style={styles.infoBox} >
                <Ionicons name="business" size={30} color="#0099CC" />
                <Text style={styles.infoText}>Công ty đang theo dõi</Text>
                <Text style={styles.infoNumber}>0</Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.accountSettingsTitle}>Thông tin dịch vụ</Text>
            <TouchableOpacity style={styles.utilityItem}>
              <Ionicons name="business" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Về BeeJobs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.utilityItem}

            >
              <Ionicons name="document-text" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Điều khoản dịch vụ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.utilityItem}>
              <Ionicons name="document-lock" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Chính sách bảo mật</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.utilityItem}>
              <Ionicons name="call-outline" size={30} color="#0099CC" />
              <Text style={styles.utilityText}>Trợ giúp</Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
          >
            <Text style={styles.logoutText}>Thoát</Text>
            <Ionicons name="log-out-outline" size={20} color="#333" />
          </TouchableOpacity> */}
        </>
      )}
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 30,
    marginBottom: 10,
    borderColor: "#0099CC",
    borderWidth: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  candidateId: {
    fontSize: 14,
    color: "#0099CC",
    fontWeight: "bold",
  },
  upgradeButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0099CC",
  },
  upgradeText: {
    color: "#0099CC",
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  editText: {
    color: "#0099CC",
  },
  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "orange",
  },
  jobManagement: {
    padding: 15,
  },
  managementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  managementBox: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  managementText: {
    marginTop: 5,
    fontSize: 14,
    color: "gray",
    justifyContent: "center",
    textAlign: "center",
  },
  infoBox: {
    width: "85%",
    height: "85%",
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 30,
  },
  infoText: {
    marginTop: 5,
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  infoNumber: {
    marginTop: 5,
    fontSize: 14,
    color: "#0099CC",
  },
  banner: {
    backgroundColor: "#0099CC",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  bannerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bannerButton: {
    color: "#fff",
    fontSize: 14,
    marginTop: 10,
  },
  utilitiesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  utilityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  utilityText: {
    fontSize: 14,
    marginLeft: 10,
  },
  accountSettingsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 14,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  logoutText: {
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
  actionsheet: {
    margin: 20,
  },
  fadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "powderblue",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "blue",
  },
  button: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  picker: {
    height: 150,
  },
  doneText: {
    textAlign: "right",
    color: "#007bff",
    fontSize: 16,
    marginTop: 10,
  },
  editButton: {
    position: "absolute",
    right: 10,
    top: 20,
    padding: 10,
    borderColor: "#0099CC",
    backgroundColor: "#0099CC",
    borderWidth: 1,
    borderRadius: 5,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Profile;
