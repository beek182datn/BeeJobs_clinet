import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default () => {
    const colorScheme = useColorScheme();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
            }}>
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Việc làm',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'bag' : 'bag-outline'} color={color} size={20}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="CV_Profile"
                options={{
                    title: 'CV & Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'file-tray-full' : 'file-tray-full-outline'} color={color} size={20}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="Notification"
                options={{
                    title: 'Thông báo',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'notifications' : 'notifications-outline'} color={color} size={20}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Tài khoản',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} size={20}/>
                    ),
                }}
            />
        </Tabs>
    )
}