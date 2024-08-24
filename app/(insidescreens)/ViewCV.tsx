import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ViewCV = () => {
  const params = useLocalSearchParams();
  const cvUrl = params.cvUrl;
  const [docs, setDocs] = useState('');

  console.log(cvUrl);
  const googleDocsUrl = `https://docs.google.com/viewer?url=${cvUrl}&embedded=true&cachebuster=${new Date().getTime()}`;
  //console.log(googleDocsUrl);
  const router = useRouter();
  const [hasStartedLoading, setHasStartedLoading] = React.useState(true);
  const [webViewKey, setWebViewKey] = React.useState(0);

  const reloadWebView = () => {
    setWebViewKey((prevKey) => prevKey + 1);
  }; useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    //console.log(googleDocsUrl);
    return () => backHandler.remove();
  }, [router]);

  const handleShouldStartLoadWithRequest = (event: { url: string; }) => {
    // Kiểm tra nếu URL không phải là URL của tài liệu và mở nó bằng trình duyệt
    if (event.url !== googleDocsUrl) {
      Linking.openURL(event.url).catch((err) =>
        Alert.alert('Không thể mở liên kết', err.message)
      );
      return false; // Không tải URL bên trong WebView
    }
    return true; // Tải URL bên trong WebView
  };

  const backAction = () => {
    router.back();
    return true;
  };

  // useEffect(()=>{
  //   setDocs(`https://docs.google.com/viewer?url=${cvUrl}&embedded=true&cachebuster=${new Date().getTime()}`)
  // }, [cvUrl]);

  // useFocusEffect(
  //   React.useCallback(()=>{
  //     setDocs(`https://docs.google.com/viewer?url=${cvUrl}&embedded=true&cachebuster=${new Date().getTime()}`)
  //   },[cvUrl])
  // )

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
            position: "absolute",
            zIndex: 100,
          }}
        >
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Xem lại CV</Text>
        <View style={styles.separator} />
      </View>
      <WebView
        incognito={true}
        source={{ uri: docs }}
        onLoadStart={() => console.log("WebView load start")}
        onLoad={() => console.log("WebView load")}
        onLoadEnd={() => console.log("WebView loaded")}
      //onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
      />
    </SafeAreaView>
  );
};

export default ViewCV;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    position: "relative",
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
