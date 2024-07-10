import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const Notification = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông báo</Text>
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
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
});