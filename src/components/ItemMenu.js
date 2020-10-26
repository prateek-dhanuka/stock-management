import { Divider, Menu } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'

import Button from './Button'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import ValidContext from '../core/ValidContext'
import { theme } from '../core/theme'

const ItemMenu = ({ item, selected, Select, color, mode }) => {
  // Visibility state
  const [visible, setVisible] = React.useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  // Valid item state
  const valid = React.useContext(ValidContext)
  const validItems = valid[item + 's']

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
          color={color}
          icon={selected === null ? null : 'check-outline'}>
          {selected === null
            ? item === 'loc'
              ? 'location'
              : `${item}`
            : selected}
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
        const color = validItems[item].color
        const bgColor = validItems[item].bgColor

        return (
          <Menu.Item
            onPress={() => {
              Select(item)
              closeMenu()
            }}
            icon={(props) => {
              return (
                <>
                  <View
                    style={[
                      styles.fillView,
                      bgColor && { backgroundColor: bgColor },
                    ]}
                  />
                  <Icon size={props.size} color={color} name={icon} />
                </>
              )
            }}
            iconcolor={color}
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
  fillView: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 14,
    height: 14,
  },
})

export default React.memo(ItemMenu)
