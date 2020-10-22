import { StyleSheet, Text, View } from 'react-native'

import { List } from 'react-native-paper'
import React from 'react'
import { theme } from '../core/theme'

const DataCell = (props) => {
  const {
    children,
    numeric,
    style,
    textStyle,
    important,
    icon,
    color,
    ...rest
  } = props

  return (
    <View {...rest} style={[styles.container, numeric && styles.right, style]}>
      <Text
        numberOfLines={1}
        style={[
          important ? styles.importantText : styles.textStyle,
          color ? { color: color } : null,
          textStyle,
        ]}>
        {children}
      </Text>
      {icon ? (
        <List.Icon style={styles.iconStyle} icon={icon} color={color} />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    justifyContent: 'flex-end',
  },
  iconStyle: {
    marginHorizontal: -5,
  },
  textStyle: {
    fontWeight: '600',
    fontSize: 15,
  },
  importantText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', //theme.colors.primary,
  },
})

export default React.memo(DataCell)
