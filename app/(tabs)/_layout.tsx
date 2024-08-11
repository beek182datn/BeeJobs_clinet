import { router, Tabs, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {registerForPushNotificationsAsync} from "@/scripts/notificationService"
export default () => {
  const colorScheme = useColorScheme();
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
          tabBarLabel: "Việc làm",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bag" : "bag-outline"}
              color= "#0099CC"
              size={20}
            />
          ),
          
        }}
      />
      
      <Tabs.Screen
        name="Messenger"
        options={{
          title: "Tin nhắn",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
              color= "#0099CC"
              size={20}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Notification"
        options={{
          title: "Thông báo",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "notifications" : "notifications-outline"}
              color= "#0099CC"
              size={20}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color= "#0099CC"
              size={20}
            />
          ),
          
        }}
      />
    </Tabs>
  );
};
