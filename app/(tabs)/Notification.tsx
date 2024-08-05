import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { getUnreadNotifications } from '@/components/fetch_data/notifi';
import { Notification ,User} from '@/components/Model/Model';

import { getUserInfo, findWorkerById, getAppliedJobsByWorker, getFollowedJobs } from "@/components/fetch_data/api";

interface NotificationScreenProps {
  userId: string;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [storedUserId, setStoredUserId] = useState<string | null>(userId ?? null);
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
        console.error('No userId found in local storage');
      }
    } catch (error) {
      console.error('Error fetching userId from local storage:', error);
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

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Thông báo</Text>
      <View style={styles.separator} />
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
        />
      ) : (
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
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
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
