import React, {useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, BackHandler, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
export default function CompanyIntroduction() {
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
          <Text style={styles.header}>Về BeeJobs</Text>
        </View>
        <View style={styles.separator} />
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lợi ích khi sử dụng BeeJobs</Text>
        <Text style={styles.sectionContent}>
          Đối với nhà tuyển dụng:
          - Tiết kiệm thời gian trong việc tìm kiếm và tuyển dụng nhân tài.
          - Quản lý và theo dõi các ứng viên một cách dễ dàng và hệ thống.
          - Tăng cường khả năng tiếp cận đến một lượng lớn ứng viên tiềm năng.
        </Text>
        <Text style={styles.sectionContent}>
          Đối với người tìm việc:
          - Dễ dàng tiếp cận và ứng tuyển vào các vị trí việc làm mong muốn.
          - Nhận được thông tin tuyển dụng nhanh chóng và chính xác.
          - Tạo và quản lý hồ sơ tìm việc một cách chuyên nghiệp và thuận tiện.
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
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position:'relative'
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
    backgroundColor: "#ddd", // Màu của đường line
    marginVertical: 10, // Khoảng cách từ trên và dưới
    position: "absolute", // Đặt đường line nằm dưới các thành phần khác
    top: 50,
    bottom: 0, // Đặt nó ở phía dưới
    left: 0,
    right: 0,
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
});
