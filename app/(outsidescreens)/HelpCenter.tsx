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
    </ScrollView>
  );
}
