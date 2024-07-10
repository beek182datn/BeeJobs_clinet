import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PersonalProfile  = () => {
  return (
    <View style={styles.scene}>
      <Text>Hồ sơ cá nhân</Text>
    </View>
  )
}

export default PersonalProfile 

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }
})