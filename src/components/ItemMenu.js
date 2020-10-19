import { Divider, Menu } from 'react-native-paper'
import React, { memo, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import Button from './Button'
import database from '@react-native-firebase/database'
import { theme } from '../core/theme'

const ItemMenu = ({ item, selected, Select, color, mode }) => {
  // Visibility state
  const [visible, setVisible] = useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  // Valid grade state
  const [validItems, setValidItems] = useState({})

  // Get Grades from database once on load
  useEffect(() => {
    database()
      .ref(`/valid/${item}s`)
      .once('value')
      .then((snapshot) => {
        // console.log('Valid grades are ', snapshot.val())
        setValidItems(snapshot.val())
      })
  }, [])

  //Decode parameters
  if (color === undefined) {
    color = theme.colors.primary
  }
  if (mode === undefined) {
    mode = 'outlined'
  }

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      style={styles.menu}
      anchor={
        <Button
          onPress={openMenu}
          style={styles.button}
          contentStyle={styles.buttonContent}
          mode={mode}
          color={color}>
          {selected === null ? `Select a ${item}` : selected}
        </Button>
      }>
      <Menu.Item
        onPress={() => {
          Select(null)
          closeMenu()
        }}
        title={`Select a ${item}`}
      />
      <Divider style={styles.divider} />
      {Object.keys(validItems).map((item) => {
        const icon = validItems[item].icon
        const text = validItems[item].text
        return (
          <Menu.Item
            onPress={() => {
              Select(item)
              closeMenu()
            }}
            icon={icon}
            title={text}
            key={item}
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
  buttonContent: {},
  divider: {
    height: 4,
  },
})

export default memo(ItemMenu)
