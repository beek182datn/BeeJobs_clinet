import React from 'react';
import { StyleSheet, Text, View, Image,SafeAreaView } from 'react-native';

const Notification = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 50 }}>
        <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Thông báo</Text>
        <View style={styles.separator} />
      </View>
      
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/notification.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Bạn chưa có thông báo nào</Text>
        <Text style={styles.description}>
          Đừng lo, chúng tôi sẽ thông báo ngay khi có tin mới cho bạn.
          Hãy khám phá tính năng khác hoặc kiểm tra lại sau.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    position: 'relative'
  },
  header: {
    fontSize: 18, color: 'black', fontWeight: 'bold'
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd', // Màu của đường line
    marginVertical: 10, // Khoảng cách từ trên và dưới
    position: 'absolute', // Đặt đường line nằm dưới các thành phần khác
    top: 50,
    bottom: 0, // Đặt nó ở phía dưới
    left: 0,
    right: 0,
  },
});