import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity,BackHandler, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Job, User } from '@/components/Model/Model';
import { getFollowedJobs, getUserInfo } from '@/components/fetch_data/api';
import JobsList from '@/components/comps/JobsList';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const JobsFollowed = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [user, setUser] = useState<User | null>();

    const backAction = () => {
        router.back();
        return true;
      };

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
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
          return () => backHandler.remove();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );
    return (
        <SafeAreaView style={styles.container}>
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
                <Text style={styles.header}>Công việc đang theo dõi</Text>
                {/* <View style={styles.separator} /> */}
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
})