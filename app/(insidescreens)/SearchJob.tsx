import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput,StatusBar, Platform, TouchableOpacity, View } from 'react-native';
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

    const [salaryOption, setShowSalaryOption] = useState(false);
    const [salary, setSalary] = useState("");
    const [salaryFilters, setSalaryFilters] = useState([
        { label: "1-5 triệu", value: "1-5" },
        { label: "5-10 triệu", value: "5-10" },
        { label: "10-15 triệu", value: "10-15" },
        { label: "trên 15 triệu", value: "15-200" },
    ]);
    const [locationOption, setShowLocationOption] = useState(false);
    const [location, setLocation] = useState("");
    const [locationFilters, setLocationFilters] = useState<{ label: string; value: string }[]>([]);
    const [experienceOption, setShowExperienceOption] = useState(false);
    const [experience, setExperience] = useState("");
    const [experienceFilters, setExperienceFilters] = useState([
        { label: "Chưa có KN", value: "khong" },
        { label: "1 năm", value: "1" },
        { label: "2 năm", value: "2" },
        { label: "3 năm", value: "3" },
        { label: "4 năm", value: "4" },
        { label: "5 năm", value: "5" },
        { label: "trên 5 năm", value: ">5" },
    ]);
    const [isNoData, setIsNoData] = useState(false);
    const [isDisplay, setisDisplay] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = await getUserInfo();
                if (userInfo) {
                    setUser(userInfo);
                }
                const provinces = await axios.get('https://provinces.open-api.vn/api/p/');
                const data: Location[] = await provinces.data;
                // Chuyển đổi dữ liệu thành định dạng mà bạn cần
                const formattedData = data.map(item => ({
                    label: item.name,
                    value: item.codename
                }));
                formattedData.push({ label: 'Địa điểm', value: '' });

                setLocationFilters(formattedData);
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, []);


    const Filter: React.FC<FilterOptionProps> = ({ label, value, onPress }) => (
        <TouchableOpacity style={styles.filterOption} onPress={() => onPress(value)}>
            <Text style={[styles.filterOptionText, { fontSize: 14 }]}>{label}</Text>
        </TouchableOpacity>
    );

    const handelSearchPress = (val: string) => {
        setSearchText(val);
        if (val === '') setJobs([]);
    }

    const handleSalary = () => {
        setShowSalaryOption(!salaryOption)
    }
    const handleSalaryPress = (value: string) => {
        let label = '';
        salaryFilters.map(item => {
            if (value === item.value)
                label = item.label;
        })
        setSalary(label)
        setSalVal(value)
        setShowSalaryOption(false);
    }

    const handleLocation = () => {
        setShowLocationOption(!locationOption)
    }
    const handleLocationPress = (value: string) => {
        let label = '';
        let val = '';
        locationFilters.map(item => {
            if (value === item.value) {
                label = item.label.replace(/Thành phố|Tỉnh/g, '').trim();
                val = item.value.replace(/tinh|thanh|pho|_/gi, ' ').trim();
            }
        })
        setLocation(label)
        setLocVal(label)
        setShowLocationOption(false);
    }

    const handleExperience = () => {
        setShowExperienceOption(!experienceOption)
    }
    const handleExperiencePress = (value: string) => {
        let label = '';
        experienceFilters.map(item => {
            if (value === item.value)
                label = item.label;
        })
        setExperience(label)
        setExVal(value)
        setShowExperienceOption(false);
    }

    const handelFilter = async () => {
        setIsLoading(true)
        try {
            const jobs = await findJobByFilterOption(user?.id_user, searchText, salaryValue, locationValue, experienceValue);
            if (jobs.length !== 0) {
                setisDisplay(true)
                setJobs(jobs)
                setIsNoData(false);
                console.log('false')
            } else {
                setisDisplay(false)
                setIsNoData(true);
                console.log('true')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handelClear = ()=>{
        setShowLocationOption(false);
        setShowSalaryOption(false);
        setShowExperienceOption(false);
        setJobs([])
        setIsNoData(false)
        setExVal('');
        setExperience('')
        setLocVal('');
        setLocation('')
        setSalVal('');
        setSalary('')
        setSearchText('')
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
                <TouchableOpacity onPress={handelFilter} style={styles.filterButton}>
                    <Ionicons name='search' size={18} color={'white'} />
                </TouchableOpacity>
            </View>

            <View style={styles.filter}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.optionFilter} onPress={handleLocation}>
                        <Text>{location ? location : 'Địa điểm'}</Text>
                        <Ionicons name='caret-down' size={18} color={'black'} />
                    </TouchableOpacity>
                    {locationOption && (
                        <View style={{ height: 200 }}>
                            <FlatList
                                data={locationFilters}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleLocationPress(item.value)}>
                                        <Text style={{}}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.optionFilter} onPress={handleSalary}>
                        <Text>{salary ? salary : 'Mức lương'}</Text>
                        <Ionicons name='caret-down' size={18} color={'black'} />
                    </TouchableOpacity>
                    {salaryOption && (
                        <View>
                            {salaryFilters.map((option, index) => (
                                <Filter
                                    key={index}
                                    label={option.label}
                                    value={option.value}
                                    onPress={handleSalaryPress}
                                />
                            ))}
                        </View>
                    )}
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.optionFilter} onPress={handleExperience}>
                        <Text>{experience ? experience : 'Kinh nghiệm'}</Text>
                        <Ionicons name='caret-down' size={18} color={'black'} />
                    </TouchableOpacity>
                    {experienceOption && (
                        <View>
                            {experienceFilters.map((option, index) => (
                                <Filter
                                    key={index}
                                    label={option.label}
                                    value={option.value}
                                    onPress={handleExperiencePress}
                                />
                            ))}
                        </View>
                    )}
                </View>

                <View>
                    <TouchableOpacity onPress={handelClear} style={{
                        backgroundColor: "#2196F3",
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 5
                    }}>
                        <Ionicons name='close' size={18} color={'white'} />
                    </TouchableOpacity>
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
                    <View style={{width: "auto", height: 'auto'}}>
                        <Text style={{fontWeight: 'bold'}}>Không có kết quả</Text>
                    </View>}
            </View>
            {!locationOption && !salaryOption && !experienceOption && !isNoData &&
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={searchText || location || experience || salary ? jobs : []}
                        renderItem={({ item }) => <JobsList job={item} callback={() => { setJobs([]) }} />}
                        keyExtractor={(item) => item._id.toString()}
                        contentContainerStyle={{ paddingBottom: 90 }}
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
        marginBottom: 20,
        justifyContent: 'space-between'
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
