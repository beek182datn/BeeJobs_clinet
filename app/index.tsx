import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.navigate("LoginScreen");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router])

  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <Image style={[styles.image, { width, height }]} source={require('../assets/images/bee_jobs_light_blue.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: 'contain',
  },
});
