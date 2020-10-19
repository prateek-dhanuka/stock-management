import { Button, Divider, Menu } from 'react-native-paper'
import React, { memo, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import database from '@react-native-firebase/database'

const OriginMenu = ({ selected, Select }) => {
  // Visibility state
  const [visible, setVisible] = useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const [validOrigins, setValidOrigins] = useState({})

  // Get Origins from database once on load
  useEffect(() => {
    database()
      .ref('/valid/origins')
      .once('value')
      .then((snapshot) => {
        // console.log('Valid origins are ', snapshot.val())
        setValidOrigins(snapshot.val())
      })
  }, [])

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      style={styles.menu}
      anchor={
        <Button onPress={openMenu} style={styles.button} mode="outlined">
          {selected === null ? 'Select a origin' : selected}
        </Button>
      }>
      <Menu.Item
        onPress={() => {
          Select(null)
          closeMenu()
        }}
        title="Select a origin"
      />
      <Divider style={styles.divider} />
      {Object.keys(validOrigins).map((origin) => {
        const icon = validOrigins[origin].icon
        const text = validOrigins[origin].text
        return (
          <Menu.Item
            onPress={() => {
              Select(origin)
              closeMenu()
            }}
            icon={icon}
            title={text}
            key={origin}
          />
        )
      })}
    </Menu>
  )
}

const styles = StyleSheet.create({
  menu: {
    marginVertical: 5,
  },
  menuItem: {},
  menuItemContent: {},
  button: {
    marginVertical: 4,
  },
  divider: {
    height: 4,
  },
})

export default memo(OriginMenu)
