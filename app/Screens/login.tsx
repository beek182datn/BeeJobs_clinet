// app/login.tsx
import React,{useEffect, useState} from 'react';
import { View, Text, StyleSheet , ToastAndroid} from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const Login = () => {
  const navigation = useNavigation();
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  useEffect(() => {
    const handleBackPress = () => {
      if (backPressedOnce) {
        BackHandler.exitApp();
       
      }else{
       ToastAndroid.show('Nhấn back một lần nữa để thoát', ToastAndroid.SHORT);
       setBackPressedOnce(true);
       // Reset trạng thái đã nhấn nút back sau 2 giây
       setTimeout(() => setBackPressedOnce(false), 2000);
      }

      return true;
     
    };

    // Đăng ký trình xử lý sự kiện nút back khi màn hình đăng nhập được hiển thị
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Hủy đăng ký trình xử lý sự kiện khi màn hình đăng nhập bị hủy
    return () => backHandler.remove();
  }, [backPressedOnce]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Màn hình Đăng nhập</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default Login;
