import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ToastAndroid,
  ActivityIndicator,
  StatusBar,
  Platform 
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchJobs,
  findJobByTitle,
  findJobBySalary,
  findJobByLocation,
  findJobByWorkType,
  getUserInfo,
} from "@/components/fetch_data/api";
import { Job, User } from "@/components/Model/Model";
import JobsList from "@/components/comps/JobsList";
import { BackHandler, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useBackHandler } from "../../components/BackHandler";
import { LinearGradient } from "expo-linear-gradient";
import AlertComponent from "@/components/AlertComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
// interface FilterOptionProps {
//   label: string;
//   value: string;
//   onPress: (value: string) => void;
// }
interface WorkerInfo {
  worker_avatar?: string;
  worker_name?: string;
}
const Home = () => {
  const [user, setUser] = useState<User | null>();
  // const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [ref, setRef] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  // const [filterOptions, setFilterOptions] = useState([
  //   { label: "Tiêu đề", value: "title" },
  //   { label: "Mức lương", value: "salary" },
  //   { label: "Địa điểm", value: "location" },
  //   { label: "Ngành nghề", value: "type" },
  // ]);
  // const [selectedFilterOption, setSelectedFilterOption] = useState("title");
  // const [inputSearch, setInputSearch] = useState("Tìm kiếm");
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  //const [userID, setuserID] = useState<string | null>(null);
  const [userData, setUserData] = useState<WorkerInfo>({});
  const [error, setError] = useState(null);
  //const params = useLocalSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const loadJobs = async (page: number) => {
    setIsLoading(true);
    try {
      const user = await getUserInfo();
      setUser(user);

      const fetchedJobs = await fetchJobs(page, user?.id_user);
      setFilteredJobs(fetchedJobs);
      setIsLoading(false);

      const response = await axios.get(`http://beejobs.io.vn:14307/getlistjob`);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      setCurrentPage(1);
      setTotalPages(1);
      loadJobs(1);
      
      return () => {
        setIsLoading(false);
      }; // Cleanup to prevent memory leaks
    }, [])
  );

  // useEffect(() => {
  //   // loadJobs(currentPage);
  //   console.log('effect')
  // }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount === 0) {
        setBackPressCount(1);
        ToastAndroid.show("Chạm lần nữa để thoát", ToastAndroid.SHORT);
        setTimeout(() => {
          setBackPressCount(0);
        }, 2000);

        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [backPressCount]);

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userID");
      console.log(userId)
      if (userId) {
        const response = await axios.get(
          `http://beejobs.io.vn:14307/api/getwokerbyUserID/${userId}`
        );
        setUserData(response.data);
        console.log(response.data);
        console.log(userId);
      } else {
        console.log("No UserID found in AsyncStorage");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 404) {
          //console.warn("User not found");
          // Xử lý khi không tìm thấy user trong cơ sở dữ liệu
        } else {
          console.error("Error fetching user data:", err.message);
          // Xử lý các lỗi khác
        }
      } else {
        console.error("Unexpected error:", err);
        // Xử lý các lỗi không phải của Axios
      }
    }
  };


  const handleSearch = () => {
    router.push({pathname: '(insidescreens)/SearchJob'})
  };


  return (
    <SafeAreaView style={styles.container}>
      
      <LinearGradient
        colors={['#f0f0f0', '#87cefa']}
        style={styles.container}
        start={[0, 1]}
        end={[1, 0]}
      >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Welcome Beejobs</Text>
          <Text style={styles.company}>{user && userData.worker_name ? userData.worker_name : "Chào mừng bạn đến với Beejobs!"}</Text>
          {!user &&
            <TouchableOpacity
              onPress={() => { router.push('/LoginScreen') }}>
              <Text style={[styles.company, { fontWeight: '700' }]}>Đăng nhập</Text>
            </TouchableOpacity>}
        </View>
        <Image
          source={{
            uri: user && userData.worker_avatar
              ? userData.worker_avatar
              : "http://beejobs.io.vn:14307/uploads/1721866026009-logo.jpg",
          }}
          style={styles.profileImage}
        />
      </View>
      <TouchableOpacity style={styles.searchBar} onPress={handleSearch}>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/bee_jobs_light_blue.png")}
            style={styles.logo}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm ... "
          // onPointerDown={handleSearch}
          onPress={handleSearch}
        />
      </TouchableOpacity>

      {isLoading && currentPage === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0099FF" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={({ item }) => <JobsList job={item} callback={()=>{}}/>}
          keyExtractor={(item) => item._id.toString()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            currentPage < totalPages ?
              <TouchableOpacity onPress={async () => {
                setCurrentPage(currentPage + 1)
                console.log(currentPage+1)
                const fetchedJobs = await fetchJobs(currentPage+1, user?.id_user);
                setFilteredJobs((prevJobs) => [...prevJobs, ...fetchedJobs]);
              }}>
                <Text style={{color: '#0099FF', alignSelf:'center', fontSize:20, fontWeight:'500'}}>Tải thêm</Text>
              </TouchableOpacity> : null
          }
        />
      )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 10,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  filterIcon: {
    fontSize: 24,
  },
  optionsContainer: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    zIndex: 1000,
  },
  filterOption: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  filterOptionText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1
  },
  loadingText: {
    fontSize: 18,
    color: "#0099FF",
  },
  logo: {
    width: 50,
    height: 50,
    zIndex: -1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 10,
  },
  company: {
    color: "#0099FF",
    fontSize: 20,
    fontWeight:'bold'
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0F7FA",
    borderWidth: 2,
    borderColor: '#0099FF'
  },
  headerText: {
    flex: 1,
  },
});

export default Home;