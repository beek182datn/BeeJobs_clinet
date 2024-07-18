import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Company, Job } from '../Model/Model';
import { useRoute, RouteProp } from '@react-navigation/native';
import { fetchJobsByCompanyId } from '../fetch_data/api';
import JobsList from './JobsList';
import { useRouter } from 'expo-router';

type RootStackParamList = {
  CompanyInfo: {
    companyInfo: Company; // Thay đổi kiểu dữ liệu này theo yêu cầu của bạn
  };
};

const CompanyJob = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const route = useRoute<RouteProp<RootStackParamList, 'CompanyInfo'>>();
  const { companyInfo } = route.params;
  const router = useRouter();

  useEffect(()=>{
    const fetchJobs = async ()=>{
      const jobs = await fetchJobsByCompanyId(companyInfo._id);
      setJobs(jobs);
    }
    fetchJobs();
  }, [router]);

  return (
    <SafeAreaView>
      <FlatList
          data={jobs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <JobsList job={item} />}
        />
    </SafeAreaView>
  )
}

export default CompanyJob

const styles = StyleSheet.create({})