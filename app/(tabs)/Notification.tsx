import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { getUnreadNotifications } from '@/components/fetch_data/notifi';
import { NotificationModel, User } from '@/components/Model/Model';
import { getUserInfo } from "@/components/fetch_data/api";
import { useFocusEffect } from 'expo-router';

interface NotificationScreenProps {
  userId: string;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [storedUserId, setStoredUserId] = useState<string | null>(userId ?? null);

  useFocusEffect(
    React.useCallback(()=>{
      if (!userId) {
        fetchUserId();
      } else {
        fetchNotifications(userId);
      }
    }, [])
  )

  useEffect(() => {
    if (!userId) {
      fetchUserId();
    } else {
      fetchNotifications(userId);
    }
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const user: User | null = await getUserInfo();
      if (user) {
        setStoredUserId(user.id_user);
        fetchNotifications(user.id_user);
      } else {
        console.log('Chua dang nhaps');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching userId from local storage:', error);
      setLoading(false);
    }
  };

  const fetchNotifications = async (userId: string) => {
    try {
      setLoading(true);
      const unreadNotifications = await getUnreadNotifications(userId);
      setNotifications(unreadNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderNotification = ({ item }: { item: NotificationModel }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else if (!storedUserId) {
      return (
        <View style={styles.content}>
          <Image
            source={require('../../assets/images/notification.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Bạn phải đăng nhập để dùng tính năng này</Text>
          <Text style={styles.description}>
            Đừng lo, chúng tôi sẽ thông báo ngay khi có tin mới cho bạn.
            Hãy khám phá tính năng khác hoặc kiểm tra lại sau.
          </Text>
        </View>
      );
    } else if (notifications.length > 0) {
      return (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
        />
      );
    } else {
      return (
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
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Thông báo</Text>
      <View style={styles.separator} />
      {renderContent()}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  header: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
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
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginRight:10,
    marginLeft:10
  },
  notificationMessage: {
    fontSize: 16,
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
