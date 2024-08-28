import { router, Tabs, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { configureNotifications, registerForPushNotificationsAsync, requestNotificationPermissions, showNotification } from "@/scripts/notificationService"
import { View, Text } from 'react-native';
import { getUnreadNotifications } from "@/components/fetch_data/notifi";
import { getUserInfo } from "@/components/fetch_data/api";
import { NotificationModel, NotificationPushModel } from "@/components/Model/Model";
import socket, { listenForNotifications } from "@/components/fetch_data/config";

export default () => {
  const [notifications, setNotifications] = useState<NotificationModel[]>();
  const colorScheme = useColorScheme();
  useFocusEffect(
    React.useCallback(() => {
      const fetchNotifi = async () => {
        const user = await getUserInfo();
        if (user) {
          const notification = await getUnreadNotifications(user.id_user);
          setNotifications(notification);
        }
      };
      fetchNotifi();
    }, []));

  useEffect(() => {

    // requestUserPermission();
    const setupNotifications = async () => {

      configureNotifications();
      const permissionGranted = await requestNotificationPermissions();
      if (!permissionGranted) {
        console.log('Notification permissions not granted');
      }
    };

    socket.on('newNotification', (notificationPushModel) => {
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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Việc làm",
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, color: focused ? "#0099CC" : "#333" }}>Việc làm</Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bag" : "bag-outline"}
              color="#0099CC"
              size={20}
            />
          ),

        }}
      />

      <Tabs.Screen
        name="Messenger"
        options={{
          title: "Tin nhắn",
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, color: focused ? "#0099CC" : "#333" }}>Tin nhắn</Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
              color="#0099CC"
              size={20}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Notification"
        options={{
          title: "Thông báo",
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, color: focused ? "#0099CC" : "#333" }}>Thông báo</Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{position:'relative'}}>
              {notifications?.length !== 0 &&
                <Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', paddingLeft: 4, paddingRight: 4, top: -15, right: -15, borderRadius: 30, fontWeight:'500', fontSize: 14 }}>{notifications?.length}</Text>
              }
              <TabBarIcon
                name={focused ? "notifications" : "notifications-outline"}
                color="#0099CC"
                size={20}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Tài khoản",
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, color: focused ? "#0099CC" : "#333" }}>Tài khoản</Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color="#0099CC"
              size={20}
            />
          ),

        }}
      />
    </Tabs>
  );
};
