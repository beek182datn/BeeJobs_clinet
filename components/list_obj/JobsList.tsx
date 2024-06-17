import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Job } from '../Model/Model';

interface JobItemProps {
  job: Job;
}

const JobsList: React.FC<JobItemProps> = ({ job }) => {
  return (
    <View style={styles.container}>
      {/* <Image source={{ uri: job.image}} style={styles.companyLogo} /> */}
      <Image source={require('../../assets/images/icon.png')} style={styles.companyLogo} />
      <View style={styles.infoContainer}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobDescription}>{job.desc}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.jobLocation}>{job.location}</Text>
        </View>
        <Text style={styles.jobSalary}>Lương: {job.salary}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 8,
    marginHorizontal:8
  },
  companyLogo: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
  },
  jobSalary: {
    fontSize: 14,
    color: '#666',
  },
});

export default JobsList;
