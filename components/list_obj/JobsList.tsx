import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Job } from '../Model/Model';

type JobsListProps = {
  jobs: Job[];
  filtered?: Job[];
};

const JobsList: React.FC<JobsListProps> = ({ jobs, filtered }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={filtered === null ? jobs: filtered}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobDescription}>{item.desc}</Text>
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
  jobItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default JobsList;
