import App from './src'
import { Provider } from 'react-native-paper'
import React from 'react'
import ValidContext from './src/core/ValidContext'
import firestore from '@react-native-firebase/firestore'
import { theme } from './src/core/theme'

const Main = () => {
  // Entire valid part from Database
  const [valid, setValid] = React.useState({})

  React.useLayoutEffect(() => {
    async function fetchData() {
      const data = {}
      const validSnap = await firestore()
        .collection('/valid/')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data())
            data[doc.id] = doc.data()
          })
          setValid(data)
        })
    }
    fetchData()
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
