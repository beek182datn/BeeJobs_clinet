// import AppliedJobs from '@/components/comps/AppliedJobs ';
// import PersonalProfile from '@/components/comps/PersonalProfile ';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import AlertComponent from "@/components/AlertComponent";
// import { useBackHandler } from "../BackHandler";
// import { SafeAreaView } from 'react-native';
// const Tab = createMaterialTopTabNavigator();


// function CV_Profile() {
//   const { backPressedCount, setBackPressedCount, showAlert, setShowAlert, message, setMessage, color, setColor } = useBackHandler(true);
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <Tab.Navigator
//         initialRouteName='PersonalProfile'
//         screenOptions={{
//           tabBarActiveTintColor: '#e91e63',
//           tabBarLabelStyle: { fontSize: 12 },
//           tabBarStyle: { backgroundColor: 'powderblue' },
//         }}>
//         <Tab.Screen
//           name="PersonalProfile"
//           component={PersonalProfile}
//           options={{ tabBarLabel: 'CV' }} />
//         <Tab.Screen
//           name="AppliedJobs"
//           component={AppliedJobs}
//           options={{ tabBarLabel: 'AppliedJob' }} />
//       </Tab.Navigator>
//     </SafeAreaView>
//   );
// }

// export default CV_Profile; 8
