import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState, } from 'react'
import { useRouter, } from "expo-router";
import { BackHandler, } from "react-native";
import AlertComponent from "@/components/AlertComponent";
import { useBackHandler } from "../../components/BackHandler";

const Notification = () => {
  const { backPressedCount, setBackPressedCount, showAlert, setShowAlert, message, setMessage, color, setColor } = useBackHandler(true);
  return (
    <SafeAreaView>
      <View>
        <Text>Notification</Text>
        <AlertComponent
          color={color}
          message={message}
          visible={showAlert}
          onClose={() => setShowAlert(false)}
        />
      </View>
    </SafeAreaView>
  )
}

export default Notification

const styles = StyleSheet.create({})