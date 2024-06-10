import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ForgotPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 30,
  },
});

export default ForgotPasswordScreen;
