import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function CompanyIntroduction() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BeeJobs - Ứng dụng kết nối việc làm</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giới thiệu về BeeJobs</Text>
        <Text style={styles.sectionContent}>
          BeeJobs là một nền tảng ứng dụng di động được thiết kế để kết nối người tìm việc và nhà tuyển dụng một cách nhanh chóng và hiệu quả. Ứng dụng này hướng đến việc cải thiện quá trình tuyển dụng, giúp các bên liên quan tiết kiệm thời gian và công sức.
        </Text>
      </View>
    </ScrollView>
  );
}
