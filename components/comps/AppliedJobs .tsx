import { SafeAreaView, StyleSheet, FlatList, Text, View, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getAppliedJobsByWorker, getUserInfo } from '../fetch_data/api'; // Giả sử bạn đã định nghĩa hàm này ở một file khác
import { AppliedJob, User } from '../Model/Model';
import { router } from 'expo-router';


const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]); // Thay thế bằng ID của người dùng
  const [user, setUser] = useState<User | null>();

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
        console.log(error)
      }
     
    };
    fetchAppliedJobs();
  }, [user?.id_user]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={appliedJobs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable onPress={() => {
            router.push({
              pathname: 'JobDetail',
              params: item.job_id
            })
          }}>
            <View style={styles.jobItem}>
              <Text>Job name: {item.job_id.title}</Text>
              <Text>Trạng thái: {item.status}</Text>
              <Text>Ứng tuyển vào: {JSON.stringify(item.applied_at)}</Text>
              <Text>CV: {JSON.stringify(item.cv)}</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default AppliedJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  jobItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 8,
  },
});
