import { ScrollView, StyleSheet, View } from 'react-native'

import FlexedButton from '../components/FlexedButton'
import GradePicker from '../components/GradePicker'
import React from 'react'
import { theme } from '../core/theme'

const AddRemoveScreen = ({ route, navigation }) => {
  const [grade, setGrade] = React.useState(null)

  const mainColor = theme.colors[route.params.type]

  return <FlexedButton />
}

const styles = StyleSheet.create()

export default AddRemoveScreen
