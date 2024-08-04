import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const ViewPdf = () => {
    const cvUri = useLocalSearchParams();
  return (
    <View>
      <Text>{JSON.stringify(cvUri)}</Text>
    </View>
  )
}

export default ViewPdf

const styles = StyleSheet.create({})