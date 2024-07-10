import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AppliedJobs  = () => {
  return (
    <View style={styles.scene}>
      <Text>Công việc đã ứng tuyển</Text>
    </View>
  )
}

export default AppliedJobs 

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }
})