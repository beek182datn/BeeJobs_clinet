import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native'

const Home = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.styleButton} onPress={() => router.push('LoginScreen')}>
        <Text style={styles.styleButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  styleButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  styleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default Home;