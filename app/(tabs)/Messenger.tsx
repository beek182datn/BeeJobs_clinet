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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Messenger = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [filteredChatRooms, setFilteredChatRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchChatRooms = async () => {
    const userId = await AsyncStorage.getItem("userID");
    try {
      const response = await axios.get(
        `http://beejobs.io.vn:14307/api/chat/getChatroomByUserIdForWorker/${userId}`
      );
      setChatRooms(response.data.data);
      setFilteredChatRooms(response.data.data);
    } catch (error) {
      setError(error.message);
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

  const handleSearch = (query) => {
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

  const handleItemPress = (job) => {
    router.push({ pathname: "(insidescreens)/ChatRoom", params: { ...job } });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
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
      <View style={styles.header}>
        <Text style={styles.title}>Tin nhắn</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredChatRooms}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const job = {
            company_id: item.otherID,
            company_name: item.company_name,
            company_logo: item.company_logo,
            userId: item.myID,
          };
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
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#2ecc71"
                    style={styles.checkMark}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.workerName}>{item.company_name}</Text>
                  <Text style={styles.lastMessage}>
                    {item.lastMessage ? item.lastMessage : "Không có tin nhắn"}
                  </Text>
                </View>
                <Text style={styles.messageTime}>16:00</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#3498db",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  searchContainer: {
    marginTop:15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: "#333",
  },
  chatRoomItem: {
    flexDirection: "row",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    color: "#333",
  },
  lastMessage: {
    fontSize: 15,
    color: "#777",
  },
  messageTime: {
    fontSize: 14,
    color: "#999",
  },
  error: {
    color: "red",
    fontSize: 18,
    alignSelf: "center",
  },
});

export default Messenger;
