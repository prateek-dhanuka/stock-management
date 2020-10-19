import { Button, Divider, Menu } from 'react-native-paper'
import React, { memo, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import database from '@react-native-firebase/database'

const ShapeMenu = ({ selected, Select }) => {
  // Visibility state
  const [visible, setVisible] = useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const [validShapes, setValidShapes] = useState({})

  // Get Shapes from database once on load
  useEffect(() => {
    database()
      .ref('/valid/shapes')
      .once('value')
      .then((snapshot) => {
        // console.log('Valid shapes are ', snapshot.val())
        setValidShapes(snapshot.val())
      })
  }, [])

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      style={styles.menu}
      anchor={
        <Button onPress={openMenu} style={styles.button} mode="outlined">
          {selected === null ? 'Select a shape' : selected}
        </Button>
      }>
      <Menu.Item
        onPress={() => {
          Select(null)
          closeMenu()
        }}
        title="Select a shape"
      />
      <Divider style={styles.divider} />
      {Object.keys(validShapes).map((shape) => {
        const icon = validShapes[shape].icon
        const text = validShapes[shape].text
        return (
          <Menu.Item
            onPress={() => {
              Select(shape)
              closeMenu()
            }}
            icon={icon}
            title={text}
            key={shape}
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

export default memo(ShapeMenu)
