import { StyleSheet, Text, View, ScrollView, Pressable, Image, Modal, TextInput, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { findCompanyById, getUserInfo, checkApplyJob, findWorkerById } from '@/components/fetch_data/api';
import { ApplyJobData, Company, User, Worker } from '@/components/Model/Model';
import { BackHandler, } from "react-native";
import { useRouter, } from "expo-router";
import { createApplyJob } from '@/components/fetch_data/api';
import * as DocumentPicker from 'expo-document-picker';
import AlertComponent from '@/components/AlertComponent';
import { Ionicons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/FontAwesome";
// const { width, height } = Dimensions.get('window');


const JobDetail = () => {
  const [companyInfo, setCompanyInfo] = useState<Company | null>();
  const [user, setUser] = useState<User | null>();
  const job = useLocalSearchParams();
  const linkVps = 'http://beejobs.io.vn:14307';
  const router = useRouter();
  // alert
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState('');
  const [worker, setWorker] = useState<Worker | null>();

  const [cv, setCv] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  // modal của ứng tuyển
  const [showModal, setShowModal] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const companyId = String(job.company_id);
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    const fetchCompanyData = async (company_id: string) => {
      const company = await findCompanyById(company_id);
      const user: User | null = await getUserInfo();
      if (user) {
        const response = await checkApplyJob(user.id_user, String(job._id));
        setIsApplied(response.isApplied);
      }
      setUser(user);
      setCompanyInfo(company)
      if (worker && user) {
        const workerInfo = await findWorkerById(user.id_user);
        setWorker(workerInfo);
      }
    }
    fetchCompanyData(companyId);
    return () => backHandler.remove();
  }, [router])

  // xử lý ứng tuyển
  const handleModalApply = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleApply = async () => {
    if (cv !== null) {
      if (user && job) {
        try {
          const data: ApplyJobData = {
            cv: {
              uri: cv.uri,
              name: cv.name!,
              type: cv.mimeType!
            }
          };
          const jobId = job._id;
          const userId = user.id_user;
          const workerName = worker?.worker_name;
          const phone = worker?.phone;
          console.log(JSON.stringify(workerName))

          const response = await createApplyJob(userId, jobId as any, data);
          // console.log(response.data);
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
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });
      if (!result.canceled) {
        setCv(result.assets[0]);
        console.log(JSON.stringify(result));
      }
    } catch (error) {
      console.error('Lỗi khi chọn tệp tin:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{padding:10}}>
        <View style={styles.headerContainer}>
          <Icon name="arrow-left" size={20} color="#000" onPress={router.back} />
          <Text style={styles.header}>Chi tiết công việc</Text>
        </View>
        <AlertComponent message={message} color={color} visible={visible} onClose={() => setVisible(false)} />
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Image source={job.company_logo != '' ? { uri: linkVps + job.company_logo } : require('../../assets/images/profile.png')} style={styles.companyLogo} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{job.title}</Text>
              <Text style={styles.companyName}>{companyInfo?.company_name}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.detailsText}>Địa chỉ: {companyInfo?.company_address}</Text>
            <Text style={styles.detailsText}>Liên hệ: {companyInfo?.taxcode}</Text>
            <Text style={styles.detailsText}>Địa điểm: {job.location}</Text>
            <Text style={styles.detailsText}>Lương: {job.salary}</Text>
          </View>
          <Text style={styles.description}>Mô tả: {job.desc}</Text>
          <Text style={styles.requirements}>Yêu cầu: {job.requirements}</Text>
          <Text style={styles.requirements}>Số lượng tuyển: {job.number_of_recruitments}</Text>
          <Text style={styles.requirements}>Hạn ứng tuyển: {job.deadline}</Text>
        </View>
      </ScrollView>

      <View>
        {isApplied &&
          <View style={{flexDirection:'row',backgroundColor:'white', width:'100%', padding:10, justifyContent:'space-between', position:'absolute', bottom:0,  shadowOpacity: 0.25,
             shadowRadius: 3.84,
             elevation: 5,
             shadowColor: '#000',}}>
            <TouchableOpacity style={styles.buttonLeft}>
              <Text style={styles.buttonTextN}>Gửi Tin Nhắn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight}>
              <Text style={styles.buttonTextN}>Ứng tuyển lại</Text>
            </TouchableOpacity>
          </View>
        }

        {!isApplied &&
          <View style={{flexDirection:'row',backgroundColor:'white', width:'100%', padding:10, justifyContent:'center', alignItems:'center', position:'absolute', bottom:0,  shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            shadowColor: '#000',}}>
            <TouchableOpacity style={styles.applyButton} onPress={handleModalApply}>
              <Text style={styles.buttonTextN}>Ứng tuyển ngay</Text>
            </TouchableOpacity>
          </View>
        }
      </View>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Image style={{ width: 200, height: 200 }} source={require('../../assets/images/bee_jobs_light_blue.png')} />
          <Pressable style={[styles.applyButton, { marginBottom: 100 }]} onPress={pickFile}>
            <Ionicons name="document-attach-outline" style={styles.applyButtonIcon} />
            <Text style={styles.applyButtonText}>Chọn CV của bạn</Text>
          </Pressable>
          {cv && (
            <View style={styles.filePreview}>
              <Text style={styles.filePreviewText}>Tệp đã chọn: {cv.name}</Text>
            </View>
          )}
          {/* <TextInput
            style={styles.input}
            placeholder="Lời nhắn"
            value={status}
            onChangeText={setStatus}
          /> */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleApply}>
              <Text style={styles.buttonText}>Ứng tuyển</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  contentContainer: {
    // padding: 20,
    // backgroundColor: '#fff',
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    // marginVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: '#666',
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
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    alignSelf:'center'
  },
});