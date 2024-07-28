import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Job, User } from '@/components/Model/Model';
import { getFollowedJobs, getUserInfo } from '@/components/fetch_data/api';
import JobsList from '@/components/comps/JobsList';
import { useFocusEffect } from 'expo-router';

const JobsFollowed = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [user, setUser] = useState<User | null>();
    const fetchData = async () => {
        const user: User | null = await getUserInfo();
        setUser(user);
        if (user) {
            try {
                const jobsFollowed = await getFollowedJobs(user.id_user);
                setJobs(jobsFollowed);
                console.log('long: ', JSON.stringify(jobsFollowed))
            } catch (error) {
                console.log(error);
            }
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 50 }}>
                <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>Việc làm đã lưu</Text>
            </View>
            <FlatList
                data={jobs}
                style={{ zIndex: 1 }}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <JobsList job={item} />}
            />
        </SafeAreaView>
    )
}

export default JobsFollowed

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
        position: 'relative'
    },
})