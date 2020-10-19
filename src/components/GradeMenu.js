import { Button, Divider, Menu } from 'react-native-paper'
import React, { memo, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import database from '@react-native-firebase/database'

const GradeMenu = ({ selected, Select }) => {
  // Visibility state
  const [visible, setVisible] = useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const [validGrades, setValidGrades] = useState({})

  // Get Grades from database once on load
  useEffect(() => {
    database()
      .ref('/valid/grades')
      .once('value')
      .then((snapshot) => {
        // console.log('Valid grades are ', snapshot.val())
        setValidGrades(snapshot.val())
      })
  }, [])

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      style={styles.menu}
      anchor={
        <Button onPress={openMenu} style={styles.button} mode="outlined">
          {selected === null ? 'Select a grade' : selected}
        </Button>
      }>
      <Menu.Item
        onPress={() => {
          Select(null)
          closeMenu()
        }}
        title="Select a grade"
      />
      <Divider style={styles.divider} />
      {Object.keys(validGrades).map((grade) => {
        const icon = validGrades[grade].icon
        const text = validGrades[grade].text
        return (
          <Menu.Item
            onPress={() => {
              Select(grade)
              closeMenu()
            }}
            icon={icon}
            title={text}
            key={grade}
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

export default memo(GradeMenu)
