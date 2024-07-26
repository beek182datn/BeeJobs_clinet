import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ChatRoomInfor {
  _id: string;
  userIds: string[];
  myID: string;
  otherID: string;
  company_logo: string;
  company_name: string;
  lastMessage: string;
}

interface Job {
  company_id: string;
  company_name: string;
  company_logo: string;
  userId: string;
}

const Messenger = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatRooms, setChatRooms] = useState<ChatRoomInfor[]>([]);
  const [filteredChatRooms, setFilteredChatRooms] = useState<ChatRoomInfor[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const firstMyID = chatRooms.length > 0 ? chatRooms[0].myID : null;
  console.log('NULL: ' +firstMyID);
  const router = useRouter();

  const fetchChatRooms = async () => {
    const userId = await AsyncStorage.getItem("userID");
    try {
      const response = await axios.get(
        `http://beejobs.io.vn:14307/api/chat/getChatroomByUserIdForWorker/${userId}`
      );
      setChatRooms(response.data.data);
      setFilteredChatRooms(response.data.data);
      
      console.log(response.data.data);
    } catch (error) {
      //setError(error.message);
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
    }, [])
  );
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = chatRooms.filter((room) =>
        room.company_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChatRooms(filtered);
    } else {
      setFilteredChatRooms(chatRooms);
    }
  };

  const handleItemPress = (job: Job) => {
    router.push({ pathname: "(insidescreens)/ChatRoom", params: { ...job, userId: firstMyID } });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Lỗi khi tải dữ liệu: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        //colors={["#f0f0f0", "#87cefa"]}
        style={styles.container}
        //start={[0, 1]}
        //end={[1, 0]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Tin nhắn</Text>
          {/* <Ionicons name="person-add" size={24} color="black" /> */}
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#ddd" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <FlatList
          data={filteredChatRooms}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const job: Job = {
              company_id: item.otherID,
              company_name: item.company_name,
              company_logo: item.company_logo,
              userId: item.myID,
            };
            console.log('huy check113: ' + JSON.stringify(job))
            return (
              <TouchableOpacity onPress={() => handleItemPress(job)}>
                <View style={styles.chatRoomItem}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{
                        uri: "http://beejobs.io.vn:14307" + item.company_logo,
                      }}
                      style={styles.avatar}
                    />
                    {/* Add a check mark icon to the avatar */}
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#3498db"
                      style={styles.checkMark}
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.workerName}>{item.company_name}</Text>
                    <Text style={styles.lastMessage}>
                      {item.lastMessage ? item.lastMessage : "No messages"}
                    </Text>
                  </View>
                  {/* Add a placeholder for the message time */}
                  {/* <Text style={styles.messageTime}>16:00</Text> */}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  chatRoomItem: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  checkMark: {
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  textContainer: {
    flex: 1,
  },
  workerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 16,
    color: "#666",
  },
  messageTime: {
    fontSize: 14,
    color: "#666",
  },
  error: {
    color: "red",
    fontSize: 18,
    alignSelf: "center",
  },
});

export default Messenger;