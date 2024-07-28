import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LastWeek from "@/components/comps/LastWeek";
import Last30days from "@/components/comps/Last30days";
import AllAppliedJobs from "@/components/comps/AllAppliedJobs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
const Tab = createMaterialTopTabNavigator();

const AppliedJobByTime = () => {
    const router = useRouter();
  return (
    <SafeAreaView style={styles.conatiner}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={router.back}
          style={{
            backgroundColor: "#2196F3",
            borderRadius: 30,
            padding: 5,
            marginLeft: 10,
          }}
        >
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Công ty đang theo dõi</Text>
        <View style={styles.separator} />
      </View>
      <Tab.Navigator
        initialRouteName="LastWeek"
        screenOptions={{
          tabBarActiveTintColor: "blue",
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: "white" },
        }}
      >
        <Tab.Screen
          name="LastWeek"
          component={LastWeek}
          options={{ tabBarLabel: "7 ngày" }}
        />
        <Tab.Screen
          name="Last30days"
          component={Last30days}
          options={{ tabBarLabel: "30 ngày" }}
        />
        <Tab.Screen
          name="AllAppliedJobs"
          component={AllAppliedJobs}
          options={{ tabBarLabel: "Tất cả" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default AppliedJobByTime;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd", // Màu của đường line
    marginVertical: 10, // Khoảng cách từ trên và dưới
    position: "absolute", // Đặt đường line nằm dưới các thành phần khác
    top: 50,
    bottom: 0, // Đặt nó ở phía dưới
    left: 0,
    right: 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
