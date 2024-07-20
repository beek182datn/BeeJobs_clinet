import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ViewCvFile = () => {
  return (
    <View style={styles.container}>
      <Text>ViewCvFile</Text>
    </View>
  )
}

export default ViewCvFile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
})