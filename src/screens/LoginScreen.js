import { StyleSheet, View } from 'react-native'
import { emailValidator, passwordValidator } from '../core/utils'

import { AppState } from 'react-native'
import Background from '../components/Background'
import Button from '../components/Button'
import Header from '../components/Header'
import React from 'react'
import TextInput from '../components/TextInput'
import auth from '@react-native-firebase/auth'
import { firebase } from '@react-native-firebase/analytics'

const LoginScreen = ({ route, navigation }) => {
  //Declare States here
  const [email, setEmail] = React.useState({ value: '', error: '' })
  const [password, setPassword] = React.useState({ value: '', error: '' })
  const [loading, setLoading] = React.useState(false)

  // Set Options here
  React.useLayoutEffect(() => {
    navigation.setOptions({ title: 'Home screen', headerShown: false })
  }, [])

  // Logout on background
  React.useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      auth()
        .signOut()
        .then(
          () => {
            console.log('Signing out due to background!')
            navigation.navigate('Login')
          },
          (error) => {
            console.log(`Couldn't Sign out, ${error}`)
          }
        )
    }
  }

  //Login pressed handler
  const onLoginPressed = async () => {
    if (loading) return

    let emailError = emailValidator(email.value)
    let passwordError = passwordValidator(password.value)

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
          passwordError = error.code
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
    if (user !== null) {
      navigation.navigate('Summary', { grade: null, shape: null, dia: null })
    }
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  return (
    <Background>
      <View style={styles.topContainer}>
        <Header>Stock Management</Header>
      </View>
      <View style={styles.centerContainer}>
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
      </View>
      <View style={styles.bottomContainer}>
        <Button loading={loading} mode="contained" onPress={onLoginPressed}>
          Login
        </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'flex-start',
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
})

export default LoginScreen
