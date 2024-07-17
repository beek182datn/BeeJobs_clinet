import { SafeAreaView, StyleSheet, FlatList, Text, View, Pressable, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getAppliedJobsByWorker, getUserInfo } from '../../components/fetch_data/api';
import { AppliedJob, User } from '../../components/Model/Model';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // Thêm thư viện icon

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [ref, setRef] = useState(false);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const user: User | null = await getUserInfo();
        setUser(user);

        if (user) {
          const jobs = await getAppliedJobsByWorker(user.id_user);
          setAppliedJobs(jobs);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAppliedJobs();
  }, [ref]);

  const refresh = ()=>{
    setRef(!ref)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{alignSelf:'center', fontSize:22, color:'black', fontWeight:'bold'}}>Việc đã ứng tuyển</Text>
      <Pressable style={styles.refreshButton} onPress={refresh}>
        <FontAwesome name="refresh" size={24} color="#FFFFFF" />
      </Pressable>
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
      {appliedJobs.length !== 0  &&
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
                <View style={styles.jobDetails}>
                  <FontAwesome name="briefcase" size={24} color="#4A90E2" style={styles.icon} />
                  <View style={styles.textContainer}>
                    <Text style={styles.jobTitle}>{item.job.title}</Text>
                    <Text style={styles.jobStatus}>CV: {fileName}</Text>
                    <Text style={styles.jobDate}>Ứng tuyển vào: {new Date(item.applied_at).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.cvText}>{item.status}</Text>
                </View>

              </Pressable>
            )
          }}
        />}
    </SafeAreaView>
  );
};

export default AppliedJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  jobItem: {
    padding: 16,
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
  jobDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    textAlign:'center'
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
});
