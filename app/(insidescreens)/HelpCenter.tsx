import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, BackHandler, Linking, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HelpCenter() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Không thể mở liên kết:', err));
  };
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    router.back();
    return true;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={backAction}
            style={{ backgroundColor: "#2196F3", borderRadius: 30, padding: 5 }}
          >
            <Ionicons name="arrow-back" size={22} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Trợ giúp</Text>
        </View>
        <View style={styles.separator} />
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên hệ hỗ trợ</Text>
          <Text style={styles.sectionContent}>
            Nếu bạn có thắc mắc hoặc cần hỗ trợ từ chúng tôi, vui lòng liên hệ qua email: {' '}
            <Text style={styles.link} onPress={() => Linking.openURL('mailto:beek182.datn@gmail.com')}>beek182.datn@gmail.com</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: 'relative'
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  header: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
    position: "absolute",
    top: 50,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
