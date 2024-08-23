import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  FlatList,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import axios, { AxiosResponse } from "axios";
import * as ImagePicker from "expo-image-picker";
type SetterFunction = (uri: string) => void;
import { User, Worker } from "../../components/Model/Model";
import { getUserInfo, findWorkerById } from "@/components/fetch_data/api";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

interface CpmpanyInfo {
  _id?: string;
  company_name?: string;
  company_address?: string;
  company_logo?: string;
}

const FollowCompany: React.FC = () => {
  const router = useRouter();
  //const [userData, setUserData] = useState<CpmpanyInfo>({});
  const [companyInfo, setCompanyInfo] = useState<CpmpanyInfo[]>([]);
  console.log(companyInfo.length)
  const [user_id, setUserId] = useState('');
  useEffect(() => {
    fetchData();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    router.back();
    return true;
  };

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userID");
      if (userId) {
        setUserId(userId);
        const response = await axios.get(
          `http://beejobs.io.vn:14307/api/findcompanys/${userId}`
        );
        setCompanyInfo(response.data);
        //console.log(response.data);
      } else {
        console.warn("No UserID found in AsyncStorage");
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

  const handleDetailCompany = (companyId: string) => {
    //const router = useRouter();
    //router.push(`/CompanyDetail2/${companyId}`);
    router.push({
      pathname: "CompanyDetail",
      params: { company_id: companyId, userId: user_id },
    });
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

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
        <Text style={styles.header}>Công ty đang theo dõi</Text>
        <View style={styles.separator} />
      </View>
      {companyInfo.length == 0 && String(companyInfo) === 'undefined' && 
      <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/iconcompany2.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Bạn chưa theo dõi công ty nào</Text>
        <Text style={styles.description}>
          Hãy theo dõi công ty nếu bạn đang quan tâm!
        </Text>
      </View>
    </View>}
    {companyInfo.length != 0 && 
      <FlatList
        data={companyInfo}
        keyExtractor={(item) => item.company_name || ""}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleDetailCompany(item._id || "")}
          >
            <Image
              source={{
                uri: `http://beejobs.io.vn:14307${item.company_logo}`,
              }}
              style={styles.icon}
            />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>{item.company_name}</Text>
              <View style={styles.address}>
                <FontAwesome name="map-marker" size={20} color="#4285F4" />
                <Text style={styles.itemSubtitle}>{item.company_address}</Text>
                {/* <Text style={styles.itemSubtitle}>{item._id}</Text> */}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="gray" />
          </TouchableOpacity>
        )}
      />
    }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position:'relative'
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 7,
    marginRight: 16,
  },
  header: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    margin: 10
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "gray",
    //marginTop: 4,
    marginLeft: 5,
  },
  address: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
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
});

export default FollowCompany;
