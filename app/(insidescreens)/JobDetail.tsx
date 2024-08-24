import { StyleSheet, Text, View, ScrollView, Pressable, Image, Modal, TextInput, TouchableOpacity, Dimensions, SafeAreaView, Linking, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { findCompanyById, getUserInfo, checkApplyJob, findWorkerById, findJobById } from '@/components/fetch_data/api';
import { ApplyJobData, Company, Job, User, Worker } from '@/components/Model/Model';
import { BackHandler, } from "react-native";
import { useRouter, } from "expo-router";
import { createApplyJob } from '@/components/fetch_data/api';
import * as DocumentPicker from 'expo-document-picker';
import AlertComponent from '@/components/AlertComponent';
import { Ionicons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/FontAwesome";
// const { width, height } = Dimensions.get('window');
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CompanyInfo from '@/components/comps/CompanyInfo';
import Infomation from '@/components/comps/Infomation';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';


const Tab = createMaterialTopTabNavigator();


const JobDetail = () => {
  const [companyInfo, setCompanyInfo] = useState<Company | null>(null);
  const [user, setUser] = useState<User | null>();
  const params = useLocalSearchParams();
  // const linkVps = 'http://beejobs.io.vn:14307';
  const router = useRouter();
  // alert
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState('');
  const [worker, setWorker] = useState<Worker | null>();

  const [cv, setCv] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fullname, setFullname] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [intro_letter, setIntroLetter] = useState('');
  const [job, setJob] = useState<Job | null>();


  // modal của ứng tuyển
  const [showModal, setShowModal] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [cvUri, setCvUri] = useState('');


  const backAction = () => {
    router.back();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    const fetchCompanyData = async () => {

      const job = await findJobById(String(params?._id))
      if (job) {
        setJob(job)
        const companyId = String(job.company_id._id);
        const company = await findCompanyById(companyId);
        if (company) {
          setCompanyInfo(company)
        }
      }
      const user: User | null = await getUserInfo();
      setUser(user);
      if (user) {
        const workerInfo = await findWorkerById(String(user.id_user));
        setWorker(workerInfo);
        if (workerInfo) {
          const response = await checkApplyJob(user.id_user, String(params._id));
          setIsApplied(response.isApplied);
        }
      }
    };

    fetchCompanyData();
    return () => backHandler.remove();
  }, [router])

  // xử lý ứng tuyển
  const handleModalApply = () => {
    if (!worker && user) {
      Alert.alert(
        "Thông báo",
        "Bạn cần cập nhật thông tin cá nhân!",
        [
          {
            text: "Hủy",
            style: "cancel", // Dùng để tạo nút hủy và đóng cảnh báo mà không làm gì thêm
          },
          {
            text: "Cập nhật",
            onPress: () => {
              router.push({
                pathname: "/CompleteProfileScreen1",
                params: { id_user: user.id_user },
              });
            },
          },
        ],
        { cancelable: true }
      );
      return;
    }

    if (!worker && !user) {
      Alert.alert(
        "Thông báo",
        "Bạn cần đang nhập!",
        [{
          text: "OK", onPress: () => { router.push('/LoginScreen') }

        }],
        { cancelable: true }
      );
      return
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleApply = async () => {
    if (cv !== null) {
      if (user && job && worker) {
        try {
          const data: ApplyJobData = {
            cv: {
              uri: cv.uri,
              name: cv.name!,
              type: cv.mimeType!
            },
            fullname: worker.worker_name,
            phone_number: worker.phone,
            email: worker.email,
            intro_letter,
          };
          const jobId = job._id;
          const userId = user.id_user;
          console.log('workerId: ' + worker._id + ' jobId: ' + jobId);
          const response = await createApplyJob(userId, jobId , data);
          console.log('workerId: ' + worker._id + ' jobId: ' + jobId);
          setShowModal(false);
          setColor('green');
          setMessage('Ứng tuyển thành công');
          setVisible(true);
          setIsApplied(true);
        } catch (error) {
          console.log('Error creating application:', error);
          setShowModal(false);
          setColor('red');
          setMessage('Hệ thống đang lỗi, thử lại sau');
          setVisible(true);
        }
      }
    } else {
      Alert.alert(
        "Thông báo",
        "Hãy chọn file CV của bạn!",
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });
      if (!result.canceled) {
        setCv(result.assets[0]);
        setCvUri(result.assets[0].uri);
        console.log(JSON.stringify(result));
      }
    } catch (error) {
      console.error('Lỗi khi chọn tệp tin:', error);
    }
  };

  const handleDetailCompany = () => {
    // if (user) {
    router.push({ pathname: 'CompanyDetail', params: { ...job as any, userId: user?.id_user, company_id: job?.company_id._id } })
    // }
  }

  const getDaysLeft = (dateString: string) => {
    // const today = new Date();
    // let applicationDeadlineDate: Date | null = null;

    // // Kiểm tra định dạng của dateString
    // if (dateString.includes('/')) {
    //   // Định dạng dd/mm/yyyy
    //   const [day, month, year] = dateString.split('/').map(Number);
    //   applicationDeadlineDate = new Date(Date.UTC(year, month - 1, day));
    // } else if (dateString.includes('-')) {
    //   // Định dạng yyyy-mm-dd
    //   const [year, month, day] = dateString.split('-').map(Number);
    //   applicationDeadlineDate = new Date(Date.UTC(year, month - 1, day));
    // }

    // // Kiểm tra ngày hợp lệ
    // if (!applicationDeadlineDate || isNaN(applicationDeadlineDate.getTime())) {
    //   return false;
    // }

    // // Tính toán số ngày còn lại
    // const timeDiff = applicationDeadlineDate.getTime() - today.getTime();
    // // const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // // Kiểm tra xem deadline đã qua hay chưa
    // return applicationDeadlineDate > today;
    const today = new Date();
    let applicationDeadlineDate: Date | null = null;

    // Kiểm tra định dạng của dateString
    if (dateString.includes('/')) {
        // Định dạng dd/mm/yyyy
        const [day, month, year] = dateString.split('/').map(Number);
        applicationDeadlineDate = new Date(year, month - 1, day);
    } else if (dateString.includes('-')) {
        // Định dạng yyyy-mm-dd
        const [year, month, day] = dateString.split('-').map(Number);
        applicationDeadlineDate = new Date(year, month - 1, day);
    }

    // Tính toán số ngày còn lại
    if (applicationDeadlineDate) {
        const timeDiff = applicationDeadlineDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysLeft < 0) {
            return false;
        } else if (daysLeft === 0) {
            return true;
        } else {
            return true;
        }
    } else {
        return false;
    }
  };


  const handleDeleteCv = () => {
    setCv(null);
  }

  const hanldeLoadCv = async () => {
    // if (cvUri) {
    //   setShowModal(false);
    //   router.push({ pathname: "ViewCV", params: { cvUrl: cvUri } });
    // }
    try {
      // const fileInfo = await FileSystem.getInfoAsync(cvUri);
      // if (!fileInfo.exists) {
      //   Alert.alert('Lỗi', 'File không tồn tại');
      // }
      // if (fileInfo.exists) {
      //   Alert.alert('Ok', 'File tồn tại');
      // }
      await Sharing.shareAsync(cvUri);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding: 10 }}>

        <View style={styles.headerContainer}>
          {/* <Icon name="arrow-left" size={20} color="#000" onPress={router.back} /> */}
          <TouchableOpacity onPress={backAction}
            style={{ backgroundColor: '#2196F3', borderRadius: 30, padding: 5 }}>
            <Ionicons name="arrow-back" size={22} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Chi tiết công việc</Text>
        </View>

        <View style={styles.topView}>
          <TouchableOpacity onPress={handleDetailCompany}>
            <Image source={companyInfo?.company_logo != '' ? { uri: companyInfo?.company_logo } : require('../../assets/images/profile.png')} style={styles.companyLogo} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { console.log(JSON.stringify(companyInfo)) }}>
            <Text style={styles.title}>{job?.title}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDetailCompany}>
            <Text style={styles.companyName}>{companyInfo?.company_name}</Text>
          </TouchableOpacity>

          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            , borderTopWidth: 0.2, borderTopColor: 'gray', width: '100%',
          }}>
            <View style={styles.gridView}>
              <Ionicons name='cash' size={30} color={'#4CAF50'} style={{ marginBottom: 10 }} />
              <Text style={{ fontSize: 14, color: 'gray' }}>Mức lương</Text>
              <Text style={styles.textGrid}>{job?.salary}</Text>
            </View>
            <View style={[styles.gridView, { borderLeftWidth: 0.5, borderLeftColor: 'gray', borderRightWidth: 0.5, borderRightColor: 'gray' }]}>
              <Ionicons name='location' size={30} color={'#4CAF50'} style={{ marginBottom: 10 }} />
              <Text style={{ fontSize: 14, color: 'gray' }}>Địa điểm</Text>
              <Text style={styles.textGrid}>{job?.location?.slice(0, 20)}</Text>
            </View>
            <View style={styles.gridView}>
              <Ionicons name='star' size={30} color={'#4CAF50'} style={{ marginBottom: 10 }} />
              <Text style={{ fontSize: 14, color: 'gray' }}>Kinh nghiệm</Text>
              <Text style={styles.textGrid}>{job?.experience}</Text>
            </View>

          </View>
        </View>
        {companyInfo &&
          <View style={styles.body}>
            <Tab.Navigator
              initialRouteName='Infomation'
              screenOptions={{
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
                tabBarStyle: { backgroundColor: 'white', height: 'auto', borderRadius: 10 },
              }}>
              <Tab.Screen
                name="Infomation"
                component={Infomation}
                options={{ tabBarLabel: 'Thông tin' }}
                initialParams={{ companyInfo, job }}
              />
              <Tab.Screen
                name="CompanyInfo"
                component={CompanyInfo}
                options={{ tabBarLabel: 'Công ty' }}
                initialParams={{ companyInfo }}
              />
            </Tab.Navigator>
          </View>}
      </ScrollView>




      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        {isApplied && getDaysLeft(String(job?.deadline)) &&
          <View style={{
            flexDirection: 'row', backgroundColor: 'white', width: '100%', padding: 10, justifyContent: 'space-between', shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            shadowColor: '#000',
          }}>
            <TouchableOpacity style={styles.buttonLeft} onPress={() => {
              if (user && companyInfo) {
                router.push({ pathname: '(insidescreens)/ChatRoom', params: { company_id: companyInfo._id, userId: user.id_user } });
              }
            }}>
              <Text style={styles.buttonTextN}>Gửi Tin Nhắn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={handleModalApply}>
              <Text style={styles.buttonTextN}>Ứng tuyển lại</Text>
            </TouchableOpacity>
          </View>
        }

        {!isApplied && getDaysLeft(String(job?.deadline)) &&
          <View style={{
            flexDirection: 'row', backgroundColor: 'white', width: '100%', padding: 10, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            shadowColor: '#000',
          }}>
            <TouchableOpacity style={styles.applyButton} onPress={handleModalApply}>
              <Text style={styles.buttonTextN}>Ứng tuyển ngay</Text>
            </TouchableOpacity>
          </View>
        }
        {!getDaysLeft(String(job?.deadline)) &&
          <View style={{
            flexDirection: 'row', backgroundColor: 'white', width: '100%', padding: 10, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            shadowColor: '#000',
          }}>
            <TouchableOpacity style={[styles.applyButton, { backgroundColor: '#e9967a' }]}>
              <Text style={styles.buttonTextN}>Hết hạn ứng tuyển</Text>
            </TouchableOpacity>
          </View>
        }
      </View>

      <Modal visible={showModal} animationType="slide" style={{ padding: 10 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 50, marginTop: 60 }}>
              <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>CV ứng tuyển</Text>
              {/* <Pressable style={[styles.refreshButton, { position: 'absolute', right: 0 }]} onPress={refresh}>
          <FontAwesome name="refresh" size={18} color="#FFFFFF" />
        </Pressable> */}
              <View style={styles.separator} />
            </View>
            <View style={styles.modalTopView}>
              {!cv &&
                <TouchableOpacity style={styles.buttonPickCv} onPress={pickFile}>
                  <Text style={{ color: 'white', fontWeight: '500' }}>Chọn cv</Text>
                </TouchableOpacity>
              }
              {cv &&
                <TouchableOpacity style={styles.buttonPickCv} onPress={hanldeLoadCv}>
                  <Text style={{ color: 'white', fontWeight: '500' }}>Xem CV</Text>
                </TouchableOpacity>
              }
              <View style={styles.hanldeCvName}>
                {cv && (
                  <Text>Tệp đã chọn: {cv.name.slice(0, 20)}</Text>
                )}
                {cv && (
                  <TouchableOpacity style={{ backgroundColor: 'gray' }} onPress={handleDeleteCv}>
                    <Ionicons name='close' size={18} color={'black'} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.modalBottomView}>
                <View style={styles.modalInfo}>
                  <Text>Họ và tên: </Text>
                  {/* <Text>Email: </Text> */}
                  <Text>Số điện thoại: </Text>
                </View>

                {worker &&
                  <View style={[styles.modalInfo, { marginLeft: 20 }]}>
                    <Text>{worker.worker_name}</Text>
                    <Text>{worker.phone}</Text>
                  </View>
                }

              </View>
            </View>

            <Text style={{ margin: 10, fontSize: 18, color: 'black', fontWeight: 500 }}>Thư giới thiệu</Text>
            <TextInput
              style={styles.input}
              placeholder="Lời nhắn"
              value={intro_letter}
              onChangeText={setIntroLetter}
              multiline={true}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleApply}>
                <Text style={styles.buttonText}>Ứng tuyển</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <AlertComponent message={message} color={color} visible={visible} onClose={() => setVisible(false)} />
    </SafeAreaView>
  )
}

export default JobDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    marginTop: 10,
    position: 'relative',
  },
  topView: {
    width: '100%',
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  companyLogo: {
    width: 70,
    height: 70,
    borderRadius: 10,
    top: -25,
    alignSelf: 'center'
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'center',
    marginBottom: 10
  },
  detailsText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 4,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 16,
    marginBottom: 10
  },
  requirements: {
    fontSize: 16,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 5,
  },
  applyButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    marginRight: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filePreview: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  filePreviewText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: 'auto',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    textAlignVertical: 'top',
    padding: 5,
    margin: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  appliedButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    marginRight: 8,
  },
  appliedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonLeft: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 10,
    alignItems: 'center',
    marginRight: 5,
    borderRadius: 5,
  },
  buttonRight: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 5,
  },
  buttonTextN: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  gridView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10
  },
  textGrid: {
    color: '#4CAF50',
    fontSize: 16
  },
  body: {
    marginTop: 10,
    flex: 1,
    width: '100%',
    height: 800,
  },
  modalTopView: {
    margin: 10,
    width: 'auto',
    padding: 10,
    // backgroundColor: 'yellow',
    borderRadius: 10,
    borderColor: 'blue',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonPickCv: {
    width: 'auto',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center'
  },
  modalBottomView: {
    padding: 10,
    // backgroundColor: 'blue',
    borderRadius: 10,
    flexDirection: 'row'
  },
  modalInfo: {
    // backgroundColor: 'green'
  },
  hanldeCvName: {
    backgroundColor: '#f0f8ff',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd', // Màu của đường line
    marginVertical: 10, // Khoảng cách từ trên và dưới
    position: 'absolute', // Đặt đường line nằm dưới các thành phần khác
    top: 50,
    bottom: 0, // Đặt nó ở phía dưới
    left: 0,
    right: 0,
  },
});