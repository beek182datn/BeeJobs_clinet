import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useRouter } from "expo-router";
import { BackHandler } from "react-native";

const Notification = () => {
  const router = useRouter();
  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [router]);
  return (
    <View>
      <Text>Notification</Text>
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({})