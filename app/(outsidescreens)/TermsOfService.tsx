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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Điều kiện Sử dụng</Text>
        <Text style={styles.sectionContent}>
          Người dùng phải cung cấp thông tin chính xác và hoàn chỉnh khi đăng ký tài khoản và sử dụng dịch vụ của chúng tôi. Người dùng phải tuân thủ các quy định về bảo mật thông tin cá nhân và không được sử dụng dịch vụ BeeJobs cho các mục đích vi phạm pháp luật. BeeJobs có quyền ngừng cung cấp dịch vụ hoặc khóa tài khoản của người dùng nếu phát hiện vi phạm điều khoản dịch vụ.
        </Text>
      </View>
    </ScrollView>
  );
}
