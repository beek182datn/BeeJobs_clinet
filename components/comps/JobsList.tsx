import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, TouchableOpacity } from 'react-native';
import { Job, User } from '../Model/Model';
import { router } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { checkFollowingJob, followJob, getUserInfo, unFollowJob } from '../fetch_data/api';

interface JobItemProps {
  job: Job;
  callback: () => void;
}

const JobsList: React.FC<JobItemProps> = ({ job, callback }) => {
  const [isFolowing, setIsFolowing] = useState(false);
  const [user, setUser] = useState<User | null>();
  const linkVps = 'http://beejobs.io.vn:14307';

  useEffect(() => {
    const fetchData = async () => {
      const data: User | null = await getUserInfo();
      if (data) {
        const folow = await checkFollowingJob(String(data.id_user), String(job._id))
        setIsFolowing(folow.isFollowing)
        // console.log(JSON.stringify(isFolowing))
      }

    }
    fetchData().catch(error => {
      console.error("Error fetching data:", error); // Xử lý lỗi nếu cần
    });
  }, [job]);

  const handleDetail = () => {
    router.push({
      pathname: 'JobDetail',
      params: job as any ,
    });
  }
  // console.log('Huy check: ' + JSON.stringify(job));
  const getDaysLeft = (dateString: string) => {
    const today = new Date();
    let applicationDeadlineDate: Date | null = null;

    // Kiểm tra định dạng của dateString
    if (dateString.includes('/')) {
        // Định dạng dd/mm/yyyy
        const [day, month, year] = dateString.split('/').map(Number);
        applicationDeadlineDate = new Date(year, month - 1, day);
    } else if (dateString.includes('-')) {
        // Định dạng yyyy-mm-dd
        const [year, month, day] = dateString.split('-').map(Number);
        applicationDeadlineDate = new Date(year, month - 1, day);
    }

    // Tính toán số ngày còn lại
    if (applicationDeadlineDate) {
        const timeDiff = applicationDeadlineDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysLeft < 0) {
            return 'Hết hạn ứng tuyển';
        } else if (daysLeft === 0) {
            return 'Ứng tuyển ngay trong hôm nay';
        } else {
            return 'Còn ' + daysLeft + ' ngày để ứng tuyển';
        }
    } else {
        return 'Ngày không hợp lệ';
    }
};


  const vv = (value: string) => {
    if (value.length >= 20) {
      return ' ...'
    }
    return ''
  }

  const handleFolowJob = async () => {
    const data: User | null = await getUserInfo();
    if (data) {
      try {
        await followJob(String(data.id_user), String(job._id))
        setIsFolowing(true)
      } catch (error) {
        console.log(error)
      }
    }
    else {
      Alert.alert(
        "Thông báo",
        "Bạn cần đăng nhập",
        [{
          text: "OK", onPress: () => {
            router.push('/LoginScreen')
          }
        }],
        { cancelable: true }
      );
    }
  }

  const handleUnFolowJob = async () => {
    const data: User | null = await getUserInfo();
    if (data) {
      try {
        await unFollowJob(String(data.id_user), String(job._id))
        setIsFolowing(false)
        callback();
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <Pressable onPress={handleDetail}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={job.company_id.company_logo != '' ? { uri: linkVps + job.company_id.company_logo } : require('../../assets/images/profile.png')}
            style={styles.logo}
          />
          <View style={styles.headerText}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{job.company_id.company_name}</Text>
          </View>
          {!isFolowing &&
            <TouchableOpacity onPress={handleFolowJob}>
              <FontAwesome name="bookmark-o" size={24} color="gray" />
            </TouchableOpacity>}
          {isFolowing &&
            <TouchableOpacity onPress={handleUnFolowJob}>
              <FontAwesome name="bookmark" size={24} color="gray" />
            </TouchableOpacity>}
        </View>
        <View style={styles.separator} />
        <View style={styles.body}>
          <View style={styles.location}>
            <FontAwesome name="map-marker" size={20} color="#4285F4" />
            <Text style={styles.locationText}>{job.location}</Text>
          </View>
          <Text style={styles.salary}>{job.salary}</Text>
          <View style={styles.footer}>
            <Text style={styles.experience}>{job.experience}</Text>
            <View style={styles.date}>
              <Ionicons name="time" size={20} color="gray" />
              <Text style={styles.dateText}>{getDaysLeft(job.deadline)}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5, // Đảm bảo giá trị này không làm cho card nổi bật hơn
    zIndex: 1, // Giá trị này thấp hơn optionsContainer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 7
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  company: {
    color: 'gray',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginVertical: 10,
  },
  body: {
    paddingHorizontal: 5,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    marginLeft: 5,
    color: 'gray',
  },
  salary: {
    backgroundColor: '#E0F7FA',
    color: '#00ACC1',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experience: {
    color: 'gray',
    flex: 1
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  dateText: {
    marginLeft: 5,
    color: 'gray',
  },
});

export default JobsList;
