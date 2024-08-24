import { FlatList, SafeAreaView, StyleSheet, Text,Image, TouchableOpacity,BackHandler, View, StatusBar, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Job, User } from '@/components/Model/Model';
import { getFollowedJobs, getUserInfo } from '@/components/fetch_data/api';
import JobsList from '@/components/comps/JobsList';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const JobsFollowed = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [user, setUser] = useState<User | null>();
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        const user: User | null = await getUserInfo();
        setUser(user);
        if (user) {
            try {
                const jobsFollowed = await getFollowedJobs(user.id_user);
                setJobs(jobsFollowed);
            } catch (error) {
                console.log(error);
            }
        }
    }
    useEffect(() => {
        fetchData();
    }, [refreshing]);

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
                        position:'absolute',
                        zIndex:100
                    }}
                >
                    <Ionicons name="arrow-back" size={22} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Việc làm đã lưu</Text>
                <View style={styles.separator} />
            </View>
            {jobs.length == 0 && 
                <View style={styles.container}>
                <View style={styles.content}>
                  <Image
                    source={require('../../assets/images/iconsave2.png')}
                    style={styles.image}
                  />
                  <Text style={styles.title}>Bạn chưa lưu công việc nào</Text>
                  <Text style={styles.description}>
                    Hãy lưu việc ngay bằng cách nhấn vào icon trên mỗi item!
                  </Text>
                </View>
              </View>
            }
            {jobs.length != 0 && 
            <FlatList
                data={jobs}
                style={{ zIndex: 1 }}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <JobsList job={item} callback={()=>{setRefreshing(!refreshing)}}/>}
            />
        }
        </SafeAreaView>
    )
}

export default JobsFollowed

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        position: 'relative',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        position:'relative'
    },
    header: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 15,
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
      content: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
      },
      image: {
        width: 100,
        height: 100,
        marginBottom: 20,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center'
      },
      description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
      },
})