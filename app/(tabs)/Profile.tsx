import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackHandler } from "../../components/BackHandler";
import AlertComponent from "@/components/AlertComponent";
import { getUserData } from '@/components/fetch_data/api';
import { useRouter } from 'expo-router';
import axios, { AxiosResponse } from "axios";
import { Job, Company, CompanyRespone, JobsResponse, User, ApplyJobData } from "../../components/Model/Model";
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const { backPressedCount, setBackPressedCount, showAlert, setShowAlert, message, setMessage, color, setColor } = useBackHandler(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Lấy user_info từ AsyncStorage
        const userInfoString = await AsyncStorage.getItem('user_info');
        if (userInfoString !== null) {
          const userData = JSON.parse(userInfoString);
          setUserData(userData);

          // Lấy id_user từ userInfo
          const id_user = userData.id_user;
          console.log(id_user)

          // Gửi yêu cầu lấy thông tin chi tiết của user
          const response: AxiosResponse<User> = await axios.post(`http://beejobs.io.vn:14307/api/users/${id_user}`);
          const detailedUserInfo = response.data;

          // Cập nhật state với thông tin chi tiết của user
          //setUserData(detailedUserInfo);
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
      setUserData(null);
      router.push('LoginScreen')
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      {userData !== null ? (
        
        <>
          {/* <View style={styles.profileHeader}>
            <Image source={{ uri: userData.avatarUrl }} style={styles.avatar} />
            <Text style={styles.name}>{userData.name}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
            <Text style={styles.infoLabel}>Số điện thoại:</Text>
            <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
          </View> */}
          {/* <Text>{userData.msg}</Text> */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <TouchableOpacity style={styles.logoutButton1} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      )}
      <AlertComponent
        color={color}
        message={message}
        visible={showAlert}
        onClose={() => setShowAlert(false)}
      />
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
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton1: {
    backgroundColor: 'blue',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Profile;
