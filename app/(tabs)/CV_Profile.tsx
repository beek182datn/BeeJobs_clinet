import AppliedJobs from '@/components/comps/AppliedJobs ';
import PersonalProfile from '@/components/comps/PersonalProfile ';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function CV_Profile() {
  return (
    <Tab.Navigator
      initialRouteName='PersonalProfile'
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: 'powderblue' },
      }}>
      <Tab.Screen
        name="PersonalProfile"
        component={PersonalProfile}
        options={{ tabBarLabel: 'Hồ sơ' }} />
      <Tab.Screen
        name="AppliedJobs"
        component={AppliedJobs}
        options={{ tabBarLabel: 'Việc đã ứng tuyển' }} />
    </Tab.Navigator>
  );
}

export default CV_Profile;