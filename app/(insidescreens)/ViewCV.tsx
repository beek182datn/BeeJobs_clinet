import { StyleSheet, View, BackHandler, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import React, {useEffect} from 'react';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
const ViewCV = () => {
  const params = useLocalSearchParams();
  const cvUrl = params.cvUrl;
  const googleDocsUrl = `https://docs.google.com/viewer?url=${cvUrl}&embedded=true`;
  const router = useRouter();

  useEffect(() => {
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
        <Text style={styles.header}>Xem lại CV</Text>
        <View style={styles.separator} />
      </View>
      <WebView style={{backgroundColor: 'white'}} source={{ uri: googleDocsUrl }} />
    </SafeAreaView>
  );
};

export default ViewCV;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position:'relative',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  header: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
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
});
