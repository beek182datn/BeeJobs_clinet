import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function CompanyIntroduction() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BeeJobs - Ứng dụng kết nối việc làm</Text>
    </ScrollView>
  );
}
