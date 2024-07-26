import { SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LastWeek from '@/components/comps/LastWeek';
import Last30days from '@/components/comps/Last30days';
import AllAppliedJobs from '@/components/comps/AllAppliedJobs';


const Tab = createMaterialTopTabNavigator();

const AppliedJobByTime = () => {

    return (
        <SafeAreaView style={styles.conatiner}>
            <Tab.Navigator
                initialRouteName='LastWeek'
                screenOptions={{
                    tabBarActiveTintColor: 'blue',
                    tabBarLabelStyle: { fontSize: 12 },
                    tabBarStyle: { backgroundColor: 'white' },
                }}>
                <Tab.Screen
                    name="LastWeek"
                    component={LastWeek}
                    options={{ tabBarLabel: '7 ngày' }}
                />
                <Tab.Screen
                    name="Last30days"
                    component={Last30days}
                    options={{ tabBarLabel: '30 ngày' }}
                />
                <Tab.Screen
                    name="AllAppliedJobs"
                    component={AllAppliedJobs}
                    options={{ tabBarLabel: 'Tất cả' }}
                />
            </Tab.Navigator>
        </SafeAreaView>

    )
}

export default AppliedJobByTime

const styles = StyleSheet.create({
    conatiner: {
        flex: 1
    }
})