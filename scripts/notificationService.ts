
import * as Notifications from 'expo-notifications';

import { NotificationPushModel } from '../components/Model/Model';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { PermissionsAndroid, Platform } from 'react-native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    // Lấy project ID từ app.json hoặc Constants
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      console.warn('projectId is not defined in app.json or app.config.js');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Cấu hình cho cả iOS và Android
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  return token;
};




export const configureNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};


export const showNotification = async (notificationPushModel: NotificationPushModel) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: notificationPushModel.title,
      body: notificationPushModel.message,
    },
    trigger: null,
  });
};
export async function requestUserPermission() {

  console.log("PermissionsAndroid.RESULTS.granted",PermissionsAndroid.RESULTS.GRANTED)
  if(Platform.OS == 'android' && Platform.Version >= 33){
  const granted =  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  console.log("grantedgranted",granted)
  if(granted === PermissionsAndroid.RESULTS.GRANTED){
      getFCMToken()
  }else{
      console.log("permission denied")
  }
  }else{
    getFCMToken()
      const authStatus = await messaging().requestPermission();
      
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
      if (enabled) {
        console.log('Authorization status:', authStatus);
        getFCMToken()
      }
  }
}
const getFCMToken = async () => {
  console.log("zô");
 let ha = await messaging().getToken();
  console.log("zô",ha);
  try {
    await messaging().registerDeviceForRemoteMessages();
    let fcmToken = await AsyncStorage.getItem('fcm_token');
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      await AsyncStorage.setItem('fcm_token', fcmToken);
      console.log('FCM token mới: ', fcmToken);
    } else {
      console.log('FCM token cũ: ', fcmToken);
    }
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  }
}