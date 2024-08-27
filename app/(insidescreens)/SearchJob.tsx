import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, StatusBar, Platform, TouchableOpacity, View, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import JobsList from '@/components/comps/JobsList';
import { Job, User } from '@/components/Model/Model';
import { findJobByFilterOption, findJobByLocation, findJobBySalary, findJobByTitle, findJobByWorkType, getUserInfo } from '@/components/fetch_data/api';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

interface FilterOptionProps {
    label: string;
    value: string;
    onPress: (value: string) => void;
}

interface Location {
    name: string;
    codename: string;
}

const SearchJob = () => {
    const [searchText, setSearchText] = useState("");
    const [locationValue, setLocVal] = useState("");
    const [salaryValue, setSalVal] = useState("");
    const [experienceValue, setExVal] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [user, setUser] = useState<User | null>();

    const [major, setmajor] = useState("");
    const [salary, setSalary] = useState("");
    const [location, setLocation] = useState("");
    const [experience, setExperience] = useState("");
    const [isNoData, setIsNoData] = useState(false);
    const [isDisplay, setisDisplay] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = await getUserInfo();
                if (userInfo) {
                    setUser(userInfo);
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, []);

    const handelSearchPress = (val: string) => {
        setSearchText(val);
        if (val === '') setJobs([]);
    }

    const handelFilter = async () => {
        setIsLoading(true)
        try {
            const jobs = await findJobByFilterOption(user?.id_user, searchText, salary, location, experience, major);
            if (jobs.length !== 0) {
                setisDisplay(true)
                setJobs(jobs)
                setIsNoData(false);
            } else {
                setisDisplay(false)
                setIsNoData(true);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handelClear = () => {
        setRefreshing(true)
        setJobs([])
        setIsNoData(false)
        setExperience('')
        setLocation('')
        setSalary('')
        setSearchText('')
        setmajor('')
        setRefreshing(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={router.back}
                    style={{
                        backgroundColor: "#2196F3",
                        borderRadius: 30,
                        padding: 5,
                        marginRight: 10,
                        zIndex: 100
                    }}
                >
                    <Ionicons name="arrow-back" size={22} color="black" />
                </TouchableOpacity>

                <TextInput
                    style={styles.searchInput}
                    placeholder={'Tìm kiếm ...'}
                    value={searchText}
                    onChangeText={handelSearchPress}
                />
                <View>

                    <TouchableOpacity onPress={handelFilter} style={styles.filterButton}>
                        <Ionicons name='search' size={18} color={'white'} />
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity onPress={handelClear} style={{
                            // backgroundColor: "#ccc",
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 5
                        }}>
                            <Ionicons name='close' size={18} color={'black'} />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

            <View style={{ backgroundColor: 'white', flexDirection: 'row' }}>
                <View>
                    <View style={styles.filter}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={{ paddingLeft: 15, fontSize: 14, fontWeight: '500' }}>Địa điểm</Text>
                            <TextInput
                                value={location}
                                onChangeText={setLocation}
                                style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 10, paddingLeft: 15, fontSize: 14 }}
                                placeholder={'Địa điểm'} />
                        </View>

                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={{ paddingLeft: 15, fontSize: 14, fontWeight: '500' }}>Kinh nghiệm</Text>
                            <TextInput
                                value={experience}
                                onChangeText={setExperience}
                                style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 10, paddingLeft: 15, fontSize: 14 }}
                                placeholder={'Kinh nghiệm'} />
                        </View>
                    </View>
                    <View style={styles.filter}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={{ paddingLeft: 15, fontSize: 14, fontWeight: '500' }}>Mức lương</Text>
                            <TextInput
                                value={salary}
                                onChangeText={setSalary}
                                style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 10, paddingLeft: 15, fontSize: 14 }}
                                placeholder={'Mức lương'} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={{ paddingLeft: 15, fontSize: 14, fontWeight: '500' }}>Ngành</Text>
                            <TextInput
                                value={major}
                                onChangeText={setmajor}
                                style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 10, paddingLeft: 15, fontSize: 14 }}
                                placeholder={'Ngành'} />

                        </View>
                    </View>
                </View>
            </View>


            <View style={styles.loadingContainer}>
                {isLoading &&
                    <View>
                        <ActivityIndicator size="large" color="#0099FF" />
                    </View>}
            </View>
            <View style={styles.loadingContainer}>
                {isNoData &&
                    <View style={{ width: "auto", height: 'auto' }}>
                        <Text style={{ fontWeight: 'bold' }}>Không có kết quả</Text>
                    </View>}
            </View>
            {!isNoData &&
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={jobs.length !== 0 ? jobs : []}
                        renderItem={({ item }) => <JobsList job={item} callback={() => { setJobs([]) }} />}
                        keyExtractor={(item) => item._id.toString()}
                        contentContainerStyle={{ paddingBottom: 90 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handelClear} />
                        }
                    />
                </View>}
        </SafeAreaView>
    );
}

export default SearchJob;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 5,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    headerContainer: {
        position: 'relative',
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        backgroundColor: "#FFFFFF",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
        zIndex: 1000
    },
    searchInput: {
        flex: 1,
        backgroundColor: "#EFEFEF",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginRight: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 3,
    },
    filterButton: {
        backgroundColor: "#2196F3",
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    filterIcon: {
        fontSize: 18,
        color: "#FFFFFF",
    },
    optionsContainer: {
        position: "absolute",
        top: 60,
        right: 10,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        zIndex: 1000,
    },
    filterOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    filterOptionText: {
        fontSize: 16,
        color: "#333",
    },
    loadingContainer: {
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: 'center'
    },
    loadingText: {
        fontSize: 18,
        color: "#666",
        marginTop: 10,
    },
    filter: {
        width: '100%',
        flexDirection: 'row',
        // marginBottom: 20,
        justifyContent: 'space-between',
    },
    optionFilter: {
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        borderColor: 'grey',
        padding: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        zIndex: 10
    }
});
