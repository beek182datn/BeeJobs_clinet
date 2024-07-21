import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Job } from '../Model/Model';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface JobItemProps {
  job: Job;
}

const JobsList: React.FC<JobItemProps> = ({ job }) => {
  const linkVps = 'http://beejobs.io.vn:14307';
  const handleDetail = () => {
    router.push({
      pathname: 'JobDetail',
      params: job
    });
  }

  const getDaysLeft = (dateString: string) => {
    const today = new Date();

    const [day, month, year] = dateString.split('/').map(Number);
    const applicationDeadlineDate = new Date(year, month - 1, day);

    const timeDiff = applicationDeadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    if(daysLeft<=0){
      return 'Hết hạn ứng tuyển'
    }
    if(isNaN(daysLeft)){
      return <Ionicons name='sad' size={18} color={'red'}/>
    }
    return 'Còn '+daysLeft+' ngày để ứng tuyển';
  }

  const vv = (value: string)=>{
    if(value.length >= 20){
      return ' ...'
    }
    return''
  }
  return (
    <Pressable onPress={handleDetail}>
      <View style={styles.container}>
        <View style={styles.containerDetail}>
          <View style={styles.companyLogo}>
            <Image source={job.company_logo != '' ? { uri: linkVps + job.company_logo } : require('../../assets/images/profile.png')} style={styles.image} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.companyName}>{job.company_name}</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.jobLocation}>{job.location.slice(0, 20)}{vv(job.location)}</Text>
              <Text style={styles.jobLocation}>{job.requirements.slice(0, 20)}{vv(job.location)}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons name='cash' size={18} color={'blue'} />
              <Text style={[styles.jobSalary, { marginLeft: 4 }]}>{job.salary}</Text>
            </View>

          </View>
        </View>
        <View style={styles.timeLeftView}>
          <Ionicons name='time' size={18} color={'gray'} />
          <Text style={styles.timeLeftText}>{getDaysLeft(job.deadline)}</Text>
        </View>
      </View>

    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 8,
    marginHorizontal: 8
  },
  containerDetail: {
    flexDirection: 'row',
  },
  companyLogo: {
    width: 50,
    height: 50,
    marginRight: 16,
    borderRadius: 8,
    elevation: 15,
    borderColor: 'gray',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 2
  },
  infoContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  companyName: {
    color: 'black',
    fontSize: 15,
    fontWeight: '400'
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    width: '50%'
  },
  jobSalary: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8
  },
  timeLeftView: {
    borderTopWidth: 0.25,
    borderTopColor: 'gray',
    paddingTop: 5,
    flexDirection: 'row'
  },
  timeLeftText: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 4
  }
});

export default JobsList;
