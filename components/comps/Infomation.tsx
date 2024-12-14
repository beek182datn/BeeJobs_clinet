import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { RouteProp, useRoute } from '@react-navigation/native';
import { Job } from '../Model/Model';

type RootStackParamList = {
  JobInfo: {
    job: Job; // Thay đổi kiểu dữ liệu này theo yêu cầu của bạn
  };
};

const Infomation = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'JobInfo'>>();
  const { job } = route.params;
  return (
      <ScrollView style={styles.container}>
        <Text style={{ color: 'black', fontWeight: '500' }}>Thông tin chung</Text>
        <View style={styles.view}>
          <Ionicons name='infinite' size={20} color={'#4CAF50'} style={styles.icon} />
          <View style={styles.viewSide}>
            <Text style={styles.textTitle}>Kinh nghiệm</Text>
            <Text style={styles.textContent}>{job.experience}</Text>
          </View>
        </View>
        <View style={styles.view}>
          <Ionicons name='calendar' size={20} color={'#4CAF50'} style={styles.icon} />
          <View style={styles.viewSide}>
            <Text style={styles.textTitle}>Hình thức</Text>
            <Text style={styles.textContent}>{job.form}</Text>
          </View>
        </View>
        <View style={styles.view}>
          <Ionicons name='people' size={20} color={'#4CAF50'} style={styles.icon} />
          <View style={styles.viewSide}>
            <Text style={styles.textTitle}>Số lượng tuyển</Text>
            <Text style={styles.textContent}>{job.number_of_recruitments}</Text>
          </View>
        </View>
        <View style={styles.view}>
          <Ionicons name='people' size={20} color={'#4CAF50'} style={styles.icon} />
          <View style={styles.viewSide}>
            <Text style={styles.textTitle}>Hạn nộp hồ sơ</Text>
            <Text style={styles.textContent}>{job.deadline}</Text>
          </View>
        </View>

        <Text style={{ color: 'black', fontWeight: '500' }}>Mô tả công việc</Text>
        <Text style={styles.textTitle}>{job.desc}</Text>

        <Text style={{ color: 'black', fontWeight: '500' }}>Yêu cầu ứng viên</Text>
        <Text style={styles.textTitle}>{job.requirements}</Text>

        <Text style={{ color: 'black', fontWeight: '500' }}>Quyền lợi</Text>
        <Text style={styles.textTitle}>{job.benefits}</Text>

        <Text style={{ color: 'black', fontWeight: '500' }}>Địa điểm làm việc</Text>
        <Text style={styles.textTitle}>{job.location}</Text>

        
      </ScrollView>
  )
}

export default Infomation

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  view: {
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  viewSide: {
    marginLeft: 15
  },
  textTitle: {
    color: 'gray',
    fontSize: 14,

  },
  textContent: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold'
  },
  icon: {
    alignSelf: 'center'
  }
})