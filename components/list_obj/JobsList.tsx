import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Job } from '../Model/Model';

type JobsListProps = {
  jobs: Job[];
};

const JobsList: React.FC<JobsListProps> = ({ jobs }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.jobContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.desc}</Text>
            <Text style={styles.requirement}>{item.requirements}</Text>
            <Text style={styles.salary}>{item.salary}</Text>
            <Text style={styles.benefit}>{item.benefits}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  jobContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  requirement: {
    fontSize: 16,
    marginBottom: 8,
  },
  salary: {
    fontSize: 16,
    marginBottom: 8,
  },
  benefit: {
    fontSize: 16,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default JobsList;
