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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đặc điểm nổi bật của BeeJobs</Text>
        <Text style={styles.sectionContent}>1. Đa dạng ngành nghề: BeeJobs cung cấp nhiều cơ hội việc làm trong các lĩnh vực khác nhau như công nghệ thông tin, tài chính, marketing, chăm sóc sức khỏe, giáo dục, và nhiều ngành nghề khác.</Text>
        <Text style={styles.sectionContent}>2. Giao diện thân thiện: Ứng dụng được thiết kế với giao diện người dùng dễ sử dụng, cho phép người dùng dễ dàng tạo hồ sơ, tìm kiếm việc làm, và nộp đơn ứng tuyển chỉ với vài thao tác đơn giản.</Text>
        <Text style={styles.sectionContent}>3. Công nghệ tiên tiến: BeeJobs áp dụng các thuật toán và công nghệ mới nhất để gợi ý các công việc phù hợp với hồ sơ và kinh nghiệm của người tìm việc, đồng thời giúp nhà tuyển dụng dễ dàng tìm thấy các ứng viên tiềm năng.</Text>
        <Text style={styles.sectionContent}>4. Tính năng nổi bật: Thông báo việc làm, Tạo hồ sơ chuyên nghiệp, Chat trực tiếp.</Text>
      </View>
    </ScrollView>
  );
}
