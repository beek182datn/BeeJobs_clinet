import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { configureNotifications, requestNotificationPermissions, requestUserPermission, showNotification } from '../scripts/notificationService';
import socket, { listenForNotifications } from "@/components/fetch_data/config";
import { useEffect } from "react";
import { NotificationPushModel } from "@/components/Model/Model";
export default function RootLayout() {

  useEffect(() => {

    requestUserPermission();
    const setupNotifications = async () => {
      
      configureNotifications();
      const permissionGranted = await requestNotificationPermissions();
      if (!permissionGranted) {
        console.log('Notification permissions not granted');
      }
    };

    socket.on('newNotification', (notificationPushModel) =>{
      console.log("Chạy")
      showNotification(notificationPushModel);
    })
 
    setupNotifications();

    listenForNotifications((notificationPushModel: NotificationPushModel) => {
      console.log("Chạy")
      showNotification(notificationPushModel);
    });
    
    return () => {
      // Cleanup logic if needed
    };
  }, []);



  return (
    <Stack initialRouteName="(outsidescreens)/index">
      <Stack.Screen name="(outsidescreens)/index" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/CompleteProfileScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/CompleteProfileScreen1" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/CompleteProfileScreen2" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/ForgotPasswordScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/RegisterScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/VerifyAccount" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/ResetPasswordScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/ChangePassword" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/FollowCompany" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/AppliedJobs" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/JobDetail" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/CompanyDetail" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/CompanyDetail2" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/ChatRoom" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/AppliedJobByTime" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/JobsFollowed" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/ViewPdf" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/CompanyIntroduction" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/TermsOfService" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/PrivacyPolicy" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/HelpCenter" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/ViewCV" options={{ headerShown: false }} />
      <Stack.Screen name="(insidescreens)/SearchJob" options={{ headerShown: false }} />
      <Stack.Screen name="(outsidescreens)/OtpVerificationScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
