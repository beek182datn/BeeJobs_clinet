import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function PrivacyPolicy() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chính sách Bảo mật của BeeJobs</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Thu thập thông tin</Text>
        <Text style={styles.sectionContent}>
          BeeJobs thu thập thông tin cá nhân từ người dùng khi đăng ký tài khoản và sử dụng các dịch vụ của chúng tôi, bao gồm tên, địa chỉ email, số điện thoại và thông tin hồ sơ cá nhân khác cần thiết.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Sử dụng thông tin</Text>
        <Text style={styles.sectionContent}>
          Thông tin cá nhân được sử dụng để cung cấp và quản lý dịch vụ của BeeJobs, bao gồm việc tạo và quản lý hồ sơ, tìm kiếm việc làm, và liên lạc với người dùng về các cơ hội việc làm phù hợp.
        </Text>
      </View>
    </ScrollView>
  );
}
