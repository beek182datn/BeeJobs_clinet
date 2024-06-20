import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { findCompanyById } from '@/components/fetch_data/api';
import { Company } from '@/components/Model/Model';

const JobDetail = () => {
  const [companyInfo, setCompanyInfo] = useState<Company | null>();
  const job = useLocalSearchParams();
  const linkVps = 'http://beejobs.io.vn:14307';

  const companyId = job.company_id + '';
  useEffect(() => {
    const fetchCompanyData = async (company_id: string) => {
      const company = await findCompanyById(company_id);
      setCompanyInfo(company)
    }
    fetchCompanyData(companyId);
  }, [])

  const handleApply = () => {
    // Xử lý logic ứng tuyển tại đây
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{job.title}</Text>
        <Image source={{ uri: linkVps + companyInfo?.company_logo }} style={styles.image} />
        <Text style={styles.company}>{companyInfo?.company_name}</Text>
        <Text style={styles.company}>{companyInfo?.company_address}</Text>
        <Text style={styles.company}>{companyInfo?.taxcode}</Text>
        <Text style={styles.company}>{job.company}</Text>
        <Text style={styles.description}>{job.description}</Text>
        <Text style={styles.location}>{job.location}</Text>
        <Text style={styles.salary}>Lương: {job.salary}</Text>
        <Text style={styles.requirements}>{job.requirements}</Text>
      </View>
      <Pressable style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>Ứng tuyển</Text>
      </Pressable>
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
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 80,
    height: 80
  }
})
