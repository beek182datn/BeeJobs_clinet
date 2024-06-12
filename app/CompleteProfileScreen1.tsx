import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from 'expo-router';

const CompleteProfileScreen1: React.FC = () => {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="arrow-left" size={20} color="#000" />
        <Text style={styles.header}>Thiết lập hồ sơ của bạn</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CompleteProfileScreen1;
