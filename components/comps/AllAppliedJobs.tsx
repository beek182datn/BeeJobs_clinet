import { StyleSheet, Text, View, SafeAreaView, Image, FlatList, Pressable, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppliedJob, User } from '../Model/Model';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAppliedJobsByWorker, getUserInfo } from '../fetch_data/api';

const AllAppliedJobs = () => {
  const [ref, setRef] = useState(false);
  const linkVps = 'http://beejobs.io.vn:14307';
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  //console.log(job)
  return (
    <SafeAreaView style={styles.container}>

      {appliedJobs.length == 0 &&
        <View style={styles.container}>
          <View style={styles.content}>
            <Image
              source={require('../../assets/images/notification.png')}
              style={styles.image}
            />
            <Text style={styles.title}>Bạn chưa ứng tuyển công việc nào</Text>
            <Text style={styles.description}>
              Hãy ứng tuyển công việc ngay bằng cách nhấn vào tab Việc làm và chọn 1 công việc phù hợp!
            </Text>
          </View>
        </View>}
      {appliedJobs.length !== 0 &&
        <FlatList
          data={appliedJobs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const fileName = item.cv.split('/').pop(); // Trích xuất tên tệp CV
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.jobItem,
                  { backgroundColor: pressed ? '#ddd' : '#fff' }
                ]}
                onPress={() => {
                  router.push({
                    pathname: 'JobDetail',
                    params: item.job
                  });
                }}
              >
                <View>

                  <View style={styles.topView}>
                    <Image source={item.job.company_logo != '' ? { uri: linkVps + item.job.company_logo } : require('../../assets/images/profile.png')} style={styles.companyLogo} />
                    <View>
                      <Text style={styles.jobTitle}>{item.job.title}</Text>
                      <Text style={styles.companyName}>{item.job.company_name}</Text>
                    </View>
                  </View>

                  <View style={[styles.topView, { justifyContent: 'space-between' }]}>
                    <View>
                      <View style={{ flexDirection: 'row' }}>
                        <Ionicons name='location' size={14} color={'blue'} style={{ marginRight: 3 }} />
                        <Text style={[styles.text, { width: '70%', flexWrap: 'wrap' }]}>{item.job.location}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Ionicons name='cash' size={14} color={'blue'} style={{ marginRight: 3 }} />
                        <Text style={styles.text}>{item.job.salary}</Text>
                      </View>
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row' }}>
                        <Ionicons name='time' size={14} color={'blue'} style={{ marginRight: 3 }} />
                        <Text style={styles.text}>{formatDate(item.job.created_at)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', backgroundColor: '#0099CC', padding: 5, alignContent: 'center', justifyContent: 'center', borderRadius: 10 }}>
                        <Ionicons name='notifications' size={14} color={'white'} style={{ marginRight: 3, alignSelf: 'center' }} />
                        <Text style={[styles.text, { color: 'white', fontSize: 14, alignSelf: 'center' }]}>{item.status}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={styles.buttonLeft} onPress={() => {
                      if (user) {
                        router.push({ pathname: '(insidescreens)/ChatRoom', params: { ...item.job, userId: user.id_user } });
                      }
                    }}>
                      <Text style={styles.buttonText}>Gửi Tin Nhắn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonRight} onPress={async () => {
                      // await WebBrowser.openBrowserAsync(linkVps+item.cv);
                      Linking.openURL(linkVps + item.cv);
                    }}>
                      <Text style={styles.buttonText}>Xem Lại CV</Text>
                    </TouchableOpacity>
                  </View>

                </View>

              </Pressable>
            )
          }}
        />}
    </SafeAreaView>
  )
}

export default AllAppliedJobs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    position: 'relative'
  },
  jobItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  jobStatus: {
    fontSize: 14,
    color: '#666',
  },
  jobDate: {
    fontSize: 12,
    color: '#999',
  },
  cvText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4A90E2',
    textAlign: 'right',
    marginLeft: 10
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  companyLogo: {
    width: 50,
    height: 50,
    marginRight: 10
  },
  companyName: {
    color: 'gray',
    fontSize: 14
  },
  topView: {
    flexDirection: 'row', // Align children in a row
    padding: 10,
  },
  text: {
    color: 'gray',
    fontSize: 12,
    width: 'auto',
    flexWrap: 'wrap'
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
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
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