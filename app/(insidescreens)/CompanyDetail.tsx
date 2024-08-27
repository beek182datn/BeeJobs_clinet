import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Pressable, ScrollView, StatusBar, Platform, TouchableOpacity, BackHandler, Alert, Linking } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Company, User } from '@/components/Model/Model';
import { findCompanyById, folowCompany, checkFolowCompany, unFolowCompany, getUserInfo } from '@/components/fetch_data/api';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CompanyJob from '@/components/comps/CompanyJob';
import CompanyInfo from '@/components/comps/CompanyInfo';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();


const CompanyDetail = () => {
    const params = useLocalSearchParams();
    // const userId = useLocalSearchParams()
    const [companyInfo, setCompanyInfo] = useState<Company | null>(null);
    // const linkVps = 'http://beejobs.io.vn:14307';
    const [isFolowing, setIsFolowing] = useState(false);
    const [user, setUser] = useState<User | null>();

    const backAction = () => {
        router.back();
        return true;
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        const companyId = String(params.company_id);
        const company = await findCompanyById(companyId);
        if (company) {
            setCompanyInfo(company);
        }
        const user: User | null = await getUserInfo();
        setUser(user);

<<<<<<< HEAD
        const folow = await checkFolowCompany(String(params.userId), String(params.company_id))
            setIsFolowing(folow.isFollowing)
=======
        if (params.userId) {
            const folow = await checkFolowCompany(String(params.userId), String(params.company_id))
            setIsFolowing(folow.isFollowing)
        }

>>>>>>> 96835f89ba045f6df3c0b09d6de3745e8a67358f
    };

    useEffect(() => {
        fetchData();
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, [router]);

    const handleFolowCompany = async () => {
        if (user) {
            try {
                await folowCompany(String(params.userId), String(params.company_id))
                setIsFolowing(true)
            } catch (error) {
                console.log(error)
            }
        } else {
            Alert.alert(
                "Thông báo",
                "Bạn cần đăng nhập",
                [{
                    text: "OK", onPress: async () => {
                        router.push('/LoginScreen')
                        await AsyncStorage.setItem('data', 'data in here!');
                    }
                }],
                { cancelable: true }
            );
        }

    }

    const handleUnFolowCompany = async () => {
        try {
            await unFolowCompany(String(params.userId), String(params.company_id))
            setIsFolowing(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <View> */}
            <View style={{ position: 'relative' }}>
                <Image source={require('../../assets/images/company.jpg')} style={{ width: '100%', height: 150 }} />
                <TouchableOpacity onPress={backAction}
                    style={{ position: 'absolute', top: 20, left: 10, backgroundColor: '#2196F3', borderRadius: 30, padding: 5 }}>
                    <Ionicons name="arrow-back" size={22} color="black" />
                </TouchableOpacity>
            </View>

            <View >
                <View style={styles.header}>
                    <Image
                        source={companyInfo?.company_logo ? { uri: companyInfo.company_logo } : require('../../assets/images/SplashLogo.png')}
                        style={styles.logo}
                    />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.companyName}>{companyInfo?.company_name}</Text>
                        <Text style={styles.companyInfo}>{companyInfo?.company_scale}</Text>
                    </View>
                    <View>
                        {!isFolowing &&
                            <TouchableOpacity style={styles.followButton} onPress={handleFolowCompany}>
                                <Text style={styles.followButtonText}>Theo dõi công ty</Text>
                            </TouchableOpacity>}
                        {isFolowing &&
                            <TouchableOpacity style={[styles.followButton, { backgroundColor: 'gray' }]} onPress={handleUnFolowCompany}>
                                <Text style={styles.followButtonText}>Hủy theo dõi</Text>
                            </TouchableOpacity>}
                        <TouchableOpacity style={[styles.followButton, { backgroundColor: '#4CAF50', marginTop: 10 }]}
                            onPress={() => {
                                if (user && companyInfo) {
                                    router.push({ pathname: '(insidescreens)/ChatRoom', params: { company_id: companyInfo._id, userId: user.id_user } });
                                } else {
                                    Alert.alert(
                                        "Thông báo",
                                        "Bạn cần đăng nhập",
                                        [{
                                            text: "OK", onPress: async () => {
                                                router.push('/LoginScreen')
                                                await AsyncStorage.setItem('data', 'data in here!');
                                            }
                                        }],
                                        { cancelable: true }
                                    );
                                }
                            }}>
                            <Text style={[styles.followButtonText, { alignSelf: 'center' }]}>Nhắn tin</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF' }}
                onPress={()=>{Linking.openURL(String(companyInfo?.company_website))}}>
                    <Ionicons name='link' size={18} color={'blue'} />
                    <Text style={{ marginLeft: 4 }}>{companyInfo?.company_website}</Text>
                </TouchableOpacity>
            </View>
            {companyInfo &&
                <View style={styles.body}>
                    <Tab.Navigator
                        initialRouteName='CompanyInfo'
                        screenOptions={{
                            tabBarActiveTintColor: 'blue',
                            tabBarLabelStyle: { fontSize: 12 },
                            tabBarStyle: { backgroundColor: 'white' },
                        }}>
                        <Tab.Screen
                            name="CompanyInfo"
                            component={CompanyInfo}
                            options={{ tabBarLabel: 'Giới thiệu công ty' }}
                            initialParams={{ companyInfo }} />
                        <Tab.Screen
                            name="CompanyJob"
                            component={CompanyJob}
                            options={{ tabBarLabel: 'Tin tuyển dụng' }}
                            initialParams={{ companyInfo }} />
                    </Tab.Navigator>
                </View>}
            {/* </View> */}
        </SafeAreaView>
    );
};

export default CompanyDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    header: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 7,
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    companyInfo: {
        fontSize: 14,
        color: '#757575',
    },
    followButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginRight: 8,
    },
    followButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    shareButton: {
        backgroundColor: '#2196F3',
        padding: 8,
        borderRadius: 4,
    },
    body: {
        flex: 1,
        backgroundColor: 'red',
        height: 1000,
        width: '100%',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tabText: {
        marginRight: 16,
        paddingVertical: 8,
        fontSize: 16,
        color: '#757575',
    },
    activeTab: {
        color: '#000000',
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
    },
    section: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionContent: {
        fontSize: 14,
        color: '#757575',
    }
});
