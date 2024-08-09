import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function TermsOfService() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Điều khoản dịch vụ của BeeJobs</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Phạm vi Dịch vụ</Text>
        <Text style={styles.sectionContent}>
          BeeJobs cung cấp nền tảng trực tuyến để kết nối người tìm việc với nhà tuyển dụng. Chúng tôi cung cấp các công cụ và tính năng để người dùng có thể tạo hồ sơ, tìm kiếm việc làm, và tương tác với nhà tuyển dụng. BeeJobs không can thiệp vào quá trình tuyển dụng của từng bên, và không chịu trách nhiệm về các giao dịch diễn ra giữa người dùng và nhà tuyển dụng.
        </Text>
      </View>
    </ScrollView>
  );
}
