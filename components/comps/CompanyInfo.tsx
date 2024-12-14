import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Company } from '../Model/Model';
import { useRoute, RouteProp } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  CompanyInfo: {
    companyInfo: Company; // Thay đổi kiểu dữ liệu này theo yêu cầu của bạn
  };
};
const CompanyInfo = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CompanyInfo'>>();
  const { companyInfo } = route.params;
  const handle = () => {
    console.log(JSON.stringify(companyInfo.company_name))
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titleText}>Giới thiệu công ty</Text>
      <Text style={styles.contentText}>{companyInfo.company_desc}</Text>
      <Text style={styles.titleText}>Địa chỉ công ty</Text>
      <Text style={styles.contentText}>{companyInfo.company_address}</Text>
    </ScrollView>
  )
}

export default CompanyInfo

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  titleText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500'
  },
  contentText: {
    color: 'gray',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8
  }
})