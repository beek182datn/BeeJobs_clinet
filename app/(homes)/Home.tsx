import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native'
import JobsList from '@/components/list_obj/JobsList';
import { Job } from '@/components/Model/Model';
import { fetchJobs } from '@/components/fetch_data/api';

const Home = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    const loadJobs = async () => {
      const fetchedJobs = await fetchJobs();
      setJobs(fetchedJobs);
      console.log(jobs);
    };
    loadJobs();
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.styleButton} onPress={() => router.push('LoginScreen')}>
        <Text style={styles.styleButtonText}>Đăng xuất</Text>
      </TouchableOpacity>

      <JobsList jobs={jobs}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  styleButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  styleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default Home;