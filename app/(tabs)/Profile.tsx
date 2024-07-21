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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ActionSheet from "react-native-actionsheet";
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { User, Worker } from "../../components/Model/Model";
import { getUserInfo, findWorkerById } from '@/components/fetch_data/api';

const Profile: React.FC = () => {
  const actionSheetRef = useRef<ActionSheet>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState("1 năm");
  const [user, setUser] = useState<User | null>();
  const [worker, setWorker] = useState<Worker | null>();

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
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
          setWorker(worker);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  const handleLogoutPress = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: () => {router.push('/LoginScreen')},
        },
      ],
      { cancelable: false }
    );
  };

  const showActionSheet = () => {
    if (actionSheetRef.current) {
      actionSheetRef.current.show();
    }
  };

  const handleActionSheetPress = (index: number) => {
    switch (index) {
      case 0:
        //Alert.alert('Chụp ảnh');
        break;
      case 1:
        DocumentPicker.getDocumentAsync({
          type: '*/*', // Allow any file type, you can specify MIME types if needed
          copyToCacheDirectory: true
        })
          .then((response) => {
            if (2>0) {
              console.log('Selected file: ', response);
              // Process the selected file here
            } else {
              console.log('User cancelled the picker');
            }
          })
          .catch((err) => {
            console.error('DocumentPicker Error: ', err);
          });
        break;
      case 2:
        //Alert.alert('Xóa ảnh đại diện');
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={showActionSheet}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.name}>Lê Văn Huy</Text>
        <Text style={styles.candidateId}>Email: vhuy887@gmail.com</Text>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeText}>Cập nhật tài khoản</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.title}>Kinh nghiệm làm việc</Text>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.editText}>Sửa</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Chưa cập nhật</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.title}>Công việc mong muốn</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>Sửa</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Chưa cập nhật</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.title}>Địa điểm làm việc mong muốn</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>Sửa</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Chưa cập nhật</Text>
      </View>

      <View style={styles.jobManagement}>
        <Text style={styles.managementTitle}>Quản lý tìm việc</Text>
        <View style={styles.row}>
          <View style={styles.managementBox}>
            <Ionicons name="briefcase" size={30} color="#0099CC" />
            <Text style={styles.managementText}>Việc làm đã ứng tuyển</Text>
          </View>
          <View style={styles.managementBox}>
            <Ionicons name="bookmark" size={30} color="#0099CC" />
            <Text style={styles.managementText}>Việc làm đã lưu</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.infoBox}>
            <Ionicons name="checkmark-circle" size={30} color="#0099CC" />
            <Text style={styles.infoText}>Việc làm phù hợp</Text>
            <Text style={styles.infoNumber}>0</Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="business" size={30} color="#0099CC" />
            <Text style={styles.infoText}>Công ty đang theo dõi</Text>
            <Text style={styles.infoNumber}>0</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.infoBox}>
            <Ionicons name="eye" size={30} color="#0099CC" />
            <Text style={styles.infoText}>NTD đã xem hồ sơ</Text>
            <Text style={styles.infoNumber}>0</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.banner}>
          <Text style={styles.bannerText}>Khám phá việc làm gần bạn</Text>
          <Text style={styles.bannerButton}>XEM NGAY</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.utilitiesTitle}>Tiện ích</Text>
        <TouchableOpacity style={styles.utilityItem}>
          <Ionicons name="document" size={30} color="#0099CC" />
          <Text style={styles.utilityText}>Hướng dẫn viết CV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.accountSettingsTitle}>Cài đặt tài khoản</Text>
        <TouchableOpacity style={styles.utilityItem} onPress={() => router.push("ResetPasswordScreen")}>
          <Ionicons name="key" size={30} color="#0099CC" />
          <Text style={styles.utilityText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.utilityItem}>
          <Ionicons name="lock-closed" size={30} color="#0099CC" />
          <Text style={styles.utilityText}>Vô hiệu hóa tài khoản</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
        <Ionicons name="log-out-outline" size={20} color="#333" />
      </TouchableOpacity>

      <ActionSheet
        ref={actionSheetRef}
        style={styles.actionsheet}
        title={"Cập nhật ảnh đại diện"}
        options={["Chụp ảnh", "Chọn từ thư viện", "Xóa ảnh đại diện", "Đóng"]}
        cancelButtonIndex={3}
        destructiveButtonIndex={2}
        onPress={handleActionSheetPress}
      />
      <Modal 
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn số năm đi làm</Text>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Sắp đi làm" value="Sắp đi làm" />
            <Picker.Item label="Dưới 1 năm" value="Dưới 1 năm" />
            <Picker.Item label="1 năm" value="1 năm" />
            <Picker.Item label="2 năm" value="2 năm" />
            <Picker.Item label="3 năm" value="3 năm" />
            <Picker.Item label="4 năm" value="4 năm" />
          </Picker>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.doneText}>Xong</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  candidateId: {
    fontSize: 14,
    color: "gray",
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
  },
  infoBox: {
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
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  picker: {
    height: 150,
  },
  doneText: {
    textAlign: 'right',
    color: '#007bff',
    fontSize: 16,
    marginTop: 10,
  },
});

export default Profile;
