import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackHandler } from "../../components/BackHandler";
import AlertComponent from "@/components/AlertComponent";
import { getUserInfo, findWorkerById } from '@/components/fetch_data/api';
import { useRouter } from 'expo-router';
import { User, Worker } from "../../components/Model/Model";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();
  const [worker, setWorker] = useState<Worker | null>();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // const emailValue = await AsyncStorage.getItem('userProfile');
        // console.log(emailValue)
        const user: User | null = await getUserInfo();
        setUser(user);
        if (user) {
          console.log('userId: ', user.id_user)
          const worker = await findWorkerById(user.id_user);
          
          setWorker(worker);
          console.log(JSON.stringify(worker?.worker_name))
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setUser(null);
      router.push('LoginScreen')
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleUpdateInfo = () => {
    router.push('/CompleteProfileScreen1');
  }

  return (
    <View style={styles.container}>
      {worker &&
        <>
          <View style={styles.profileHeader}>
            <Image source={{ uri: worker?.worker_avatar }} style={styles.avatar} />
            <Text style={styles.name}>{worker?.worker_name}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{worker?.phone}</Text>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{worker?.email}</Text>
          </View>
        </>
      }

      {user !== null &&
        <>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateInfo}>
            <Text style={styles.updateText}>Hoàn thiện hồ sơ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  updateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
