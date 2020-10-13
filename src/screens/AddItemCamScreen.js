import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, View, Dimensions } from 'react-native'
import { Text } from 'react-native-paper'
import { Camera } from 'expo-camera'
import { useHeaderHeight } from '@react-navigation/stack'
import * as Permissions from 'expo-permissions'

const AddItemCamScreen = ({ route, navigation }) => {
  // camera permissions
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [camera, setCamera] = useState(null)

  // Screen ratio and image padding
  const [imagePadding, setImagePadding] = useState(0)
  const [ratio, setRatio] = useState('4:3')
  const { height, width } = Dimensions.get('window')
  const screenRatio = height / width
  const [isRatioSet, setIsRatioSet] = useState(false)

  const headerHeight = useHeaderHeight()

  // on screen load, ask for permissions to use the camera
  useEffect(() => {
    async function getCameraStatus() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA)
      setHasCameraPermission(status === 'granted')
    }
    getCameraStatus()
  }, [])

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = '4:3' //Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await camera.getSupportedRatiosAsync()

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {}
      let realRatios = {}
      let minDistance = null
      for (const ratio of ratios) {
        const parts = ratio.split(':')
        const realRatio = parseInt(parts[0]) / parseInt(parts[1])
        realRatios[ratio] = realRatio
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio
        distances[ratio] = realRatio
        if (minDistance == null) {
          minDistance = ratio
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio
          }
        }
      }
      // set the best match
      desiredRatio = minDistance
      console.log(`Using the ratio ${desiredRatio}`)
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      )
      // set the preview padding and preview ratio
      setImagePadding(remainder / 2)
      setRatio(desiredRatio)
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true)
    }
  }

  // the camera must be loaded in order to access the supported ratios
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio()
    }
  }

  //Set the NavBar
  navigation.setOptions({
    headerStyle: {
      backgroundColor: 'green',
    },
    headerTintColor: 'lightyellow',
  })

  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <Text>Waiting for camera permissions</Text>
      </View>
    )
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text>No access to camera</Text>
      </View>
    )
  } else {
    return (
      <View
        style={[
          styles.container,
          { marginTop: 2 * imagePadding - headerHeight, marginBottom: 0 },
        ]}>
        <Camera
          style={styles.cameraPreview}
          onCameraReady={setCameraReady}
          ref={(ref) => {
            setCamera(ref)
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cameraPreview: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  information: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
})

export default AddItemCamScreen
