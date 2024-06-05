// import { Tabs } from 'expo-router';
// import React from 'react';

// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

import { View, Text, StyleSheet, Image } from "react-native";
import { router, useRouter } from "expo-router";
import React, { useEffect } from "react";

const WellCome = () => {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("Screens/login");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/images/wellcome.jpg")}
      />
      <View style={styles.textContainer}>
        <Text style={styles.textItem}>Kết Nối Việc Làm</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  },
  textItem: {
     // Màu nền của văn bản
    padding: 10, 
    color:"#99FFFF", 
    fontSize: 30,
    fontWeight:"bold",
    textShadowColor: 'rgba(0,0,0,1)',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius: 10, 
  },
  textContainer:{
      position: 'absolute',
      top: 90,
      left: 0,
      right: 0,
      alignItems: 'center'
  }
});
export default WellCome;
