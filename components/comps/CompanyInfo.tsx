import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
    console.log(JSON.stringify(companyInfo))
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Giới thiệu công ty</Text>
      <Text style={styles.contentText}>This approach ensures that both tabs have
         access to the necessary data for rendering the company information and job listings.</Text>
      <Text style={styles.titleText}>Địa chỉ công ty</Text>
      <Text style={styles.contentText}>{companyInfo.company_address}</Text>
    </SafeAreaView>
  )
}

export default CompanyInfo

const styles = StyleSheet.create({
  container: {
    padding:10
  },
  titleText:{
    color:'black',
    fontSize:18,
    fontWeight:'400',
  },
  contentText:{
    color:'gray',
    fontSize:16,
    marginTop:8,
    marginBottom:8
  }
})