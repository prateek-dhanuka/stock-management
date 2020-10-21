import App from './src'
import { Provider } from 'react-native-paper'
import React from 'react'
import ValidContext from './src/core/ValidContext'
import database from '@react-native-firebase/database'
import { theme } from './src/core/theme'

const Main = () => {
  // Entire valid part from Database
  const [valid, setValid] = React.useState({})

  React.useEffect(() => {
    database()
      .ref('/valid/')
      .once('value')
      .then((snapshot) => {
        setValid(snapshot.val())
        console.log('Got Valid = ', snapshot.val())
      })
  }, [])

  return (
    <ValidContext.Provider value={valid}>
      <Provider theme={theme}>
        <App />
      </Provider>
    </ValidContext.Provider>
  )
}

export default Main
