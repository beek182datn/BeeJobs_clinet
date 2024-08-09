import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function HelpCenter() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Trung tâm Trợ giúp BeeJobs</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hướng dẫn sử dụng ứng dụng</Text>
        <Text style={styles.sectionContent}>
          Để biết thêm chi tiết về cách sử dụng ứng dụng BeeJobs, vui lòng xem Hướng dẫn sử dụng tại đây: {' '}
          <Text style={styles.link} onPress={() => openLink('https://github.com/beek182datn/BeeJobs_Client_Companies/commit/d03bceeda0236fcff4538c8f071e08e9491f9500?diff=unified&w=0')}>Hướng dẫn sử dụng</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Câu hỏi thường gặp (FAQs)</Text>
        <Text style={styles.sectionContent}>
          Các câu hỏi thường gặp về BeeJobs và câu trả lời của chúng tôi có thể được tìm thấy tại đây: {' '}
          <Text style={styles.link} onPress={() => openLink('https://chatgpt.com/?fbclid=IwAR0eRtFjMuf5sESaa5W_PcBC3pgg-trMHTPYZi_FnH6QrhAlqKy_cXMDs70')}>FAQs</Text>
        </Text>
      </View>
    </ScrollView>
  );
}
