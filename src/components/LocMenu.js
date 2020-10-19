import { Button, Divider, Menu } from 'react-native-paper'
import React, { memo, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import database from '@react-native-firebase/database'

const LocMenu = ({ selected, Select }) => {
  // Visibility state
  const [visible, setVisible] = useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const [validLocs, setValidLocs] = useState({})

  // Get Locs from database once on load
  useEffect(() => {
    database()
      .ref('/valid/locs')
      .once('value')
      .then((snapshot) => {
        // console.log('Valid locs are ', snapshot.val())
        setValidLocs(snapshot.val())
      })
  }, [])

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      style={styles.menu}
      anchor={
        <Button onPress={openMenu} style={styles.button} mode="outlined">
          {selected === null ? 'Select a loc' : selected}
        </Button>
      }>
      <Menu.Item
        onPress={() => {
          Select(null)
          closeMenu()
        }}
        title="Select a loc"
      />
      <Divider style={styles.divider} />
      {Object.keys(validLocs).map((loc) => {
        const icon = validLocs[loc].icon
        const text = validLocs[loc].text
        return (
          <Menu.Item
            onPress={() => {
              Select(loc)
              closeMenu()
            }}
            icon={icon}
            title={text}
            key={loc}
          />
        )
      })}
    </Menu>
  )
}

const styles = StyleSheet.create({
  menu: {},
  menuItem: {},
  menuItemContent: {},
  button: {
    marginVertical: 4,
  },
  divider: {
    height: 4,
  },
})

export default memo(LocMenu)
