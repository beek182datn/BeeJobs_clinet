import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Company } from '@/components/Model/Model';
import { findCompanyById } from '@/components/fetch_data/api';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CompanyJob from '@/components/comps/CompanyJob';
import CompanyInfo from '@/components/comps/CompanyInfo';
import { RouteProp } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();


const CompanyDetail = () => {
    const job = useLocalSearchParams();
    const [companyInfo, setCompanyInfo] = useState<Company | null>(null);
    const linkVps = 'http://beejobs.io.vn:14307';

    useEffect(() => {
        const companyId = String(job.company_id);
        const fetchData = async () => {
            const company = await findCompanyById(companyId);
            if (company) {
                setCompanyInfo(company);
            }
        };
        fetchData();
    }, [router]);

    return (
        <SafeAreaView style={styles.container}>
            {/* <View> */}
            <View style={{ position: 'relative' }}>
                <Image source={require('../../assets/images/company.jpg')} style={{ width: '100%', height: 150 }} />
                <TouchableOpacity onPress={()=>{router.push('/Home')}}
                    style={{ position: 'absolute', top: 20, left: 10, backgroundColor: '#2196F3', borderRadius: 30, padding: 5 }}>
                    <Ionicons name="arrow-back" size={22} color="black" />
                </TouchableOpacity>
            </View>

            <View >
                <View style={styles.header}>
                    <Image
                        source={companyInfo?.company_logo ? { uri: linkVps + companyInfo.company_logo } : require('../../assets/images/SplashLogo.png')}
                        style={styles.logo}
                    />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.companyName}>{companyInfo?.company_name}</Text>
                        <Text style={styles.companyInfo}>{companyInfo?.company_scale}</Text>
                    </View>
                    <TouchableOpacity style={styles.followButton} onPress={() => {
                        console.log(JSON.stringify(companyInfo))
                    }}>
                        <Text style={styles.followButtonText}>Theo dõi công ty</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton}>
                        <FontAwesome name="share-alt" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', backgroundColor:'#FFFFFF'}}>
                    <Ionicons name='link' size={18} color={'blue'}/>
                    <Text style={{marginLeft:4}}>{companyInfo?.company_website}</Text>
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
        borderRadius: 30,
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
