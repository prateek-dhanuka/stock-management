import React, { useEffect, useState } from 'react'
import { emailValidator, passwordValidator } from '../core/utils'

import Background from '../components/Background'
import Button from '../components/Button'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import auth from '@react-native-firebase/auth'

const LoginScreen = ({ route, navigation }) => {
  //Declare States here
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)

  // Set Options here
  navigation.setOptions({ title: 'Home screen', headerShown: false })

  //Login pressed handler
  const onLoginPressed = async () => {
    if (loading) return

    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    setLoading(true)

    auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(() => {
        console.log('Signed In!')
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          emailError = error.code
        } else if (error.code === 'auth/user-disabled') {
          emailError = error.code
        } else if (error.code === 'auth/user-not-found') {
          emailError = error.code
        } else if (error.code === 'auth/wrong-password') {
          passwordError = error.code
        } else {
          console.error(error)
        }
        if (emailError || passwordError) {
          setEmail({ ...email, error: emailError })
          setPassword({ ...password, error: passwordError })
        }
      })

    setLoading(false)
  }

  //Handle User state changes
  function onAuthStateChanged(user) {
    navigation.navigate('Summary', { grade: null, shape: null, dia: null })
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  return (
    <Background>
      <Header>Stock Management</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.type}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        autoCapitalize="none"
      />

      <Button loading={loading} mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
    </Background>
  )
}

export default LoginScreen
