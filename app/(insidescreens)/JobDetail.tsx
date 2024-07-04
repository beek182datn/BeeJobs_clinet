import { StyleSheet, Text, View, ScrollView, Pressable, Image, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { findCompanyById, getUserData } from '@/components/fetch_data/api';
import { ApplyJobData, Company, User } from '@/components/Model/Model';
import { BackHandler, } from "react-native";
import { useRouter, } from "expo-router";
import { createApplyJob } from '@/components/fetch_data/api';
import * as DocumentPicker from 'expo-document-picker';
import AlertComponent from '@/components/AlertComponent';
import { Ionicons } from '@expo/vector-icons';


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

  const [applyJobData, setApplyJobData] = useState<ApplyJobData>({
    cv: null,
    status: '',
  });

  // modal của ứng tuyển
  const [showModal, setShowModal] = useState(false);

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
      setUser(await getUserData());
      setCompanyInfo(company)
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
    const workerId = String(user?.id_user);
    const jobId = String(job._id);
    if (applyJobData.cv !== null && applyJobData.status !== '') {
      try {
        const response = await createApplyJob(workerId, jobId, applyJobData);
        setShowModal(false)
        setColor('green')
        setMessage('Ứng tuyển thành công')
        setVisible(true)
      } catch (error) {
        console.error('Error creating application:', error);
        setShowModal(false)
        setColor('red')
        setMessage('Hệ thống đang lỗi, thử lại sau')
        setVisible(true)
      }
    }
  }

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      if (!result.canceled) {
        console.log(result);
        setApplyJobData((prevData) => ({
          ...prevData,
          cv: result.assets[0],
        }));
      } else {
        console.log('User cancelled file picker');
      }
    } catch (err) {
      console.log('Error picking file:', err);
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setApplyJobData((prevData) => ({
      ...prevData,
      status: newStatus,
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <AlertComponent message={message} color={color} visible={visible} onClose={() => setVisible(false)} />
      <View style={styles.content}>
        <Text style={styles.title}>{job.title}</Text>
        <Image source={job.company_logo != '' ? { uri: linkVps + job.company_logo } : require('../../assets/images/profile.png')} style={styles.image} />
        <Text style={styles.company}>{companyInfo?.company_name}</Text>
        <Text style={styles.company}>{companyInfo?.company_address}</Text>
        <Text style={styles.company}>{companyInfo?.taxcode}</Text>
        <Text style={styles.company}>{job.company}</Text>
        <Text style={styles.description}>{job.description}</Text>
        <Text style={styles.location}>{job.location}</Text>
        <Text style={styles.salary}>Lương: {job.salary}</Text>
        <Text style={styles.requirements}>{job.requirements}</Text>
      </View>
      <Pressable style={styles.applyButton} onPress={handleModalApply}>
        <Text style={styles.applyButtonText}>Ứng tuyển</Text>
      </Pressable>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
        <Image style={{ width:200 , height:200 }} source={require('../../assets/images/bee_jobs_light_blue.png')} />
          <Pressable style={[styles.applyButton, {marginBottom:100}]} onPress={pickFile}>
            <Ionicons name="document-attach-outline" style={styles.applyButtonIcon} />
            <Text style={styles.applyButtonText}>Chọn CV của bạn</Text>
          </Pressable>
          {applyJobData.cv && (
            <View style={styles.filePreview}>
              <Text style={styles.filePreviewText}>
                Tệp đã chọn: {applyJobData.cv.name}
              </Text>
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Lời nhắn"
            value={applyJobData.status}
            onChangeText={handleStatusChange}
          />
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

    </ScrollView>
  )
}

export default JobDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  salary: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  requirements: {
    fontSize: 16,
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  applyButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  image: {
    width: 80,
    height: 80
  },
  scene: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#2196F3',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
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
})
