import { grade_display, shape_display } from '../assets/constants'

export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/

  if (!email || email.length <= 0) return 'Email cannot be empty.'
  if (!re.test(email)) return 'Oops! We need a valid email address.'

  return ''
}

export const passwordValidator = (password) => {
  if (!password || password.length <= 0) return 'Password cannot be empty.'

  return ''
}

export const nameValidator = (name) => {
  if (!name || name.length <= 0) return 'Name cannot be empty.'

  return ''
}

export const getSummaryHeader = (params) => {
  var header_text = 'Summary'
  if (params.grade !== null || params.shape !== null || params.dia !== null) {
    header_text = ''
    if (params.shape != null) {
      header_text += `${shape_display[params.shape]}`
    }
    if (params.dia != null) {
      header_text += `${params.dia} `
    }
    if (params.grade != null) {
      header_text += `${grade_display[params.grade]}`
    }
    // header_text = header_text.slice(0, -1)
  }
  return header_text
}

export const getItemScreenColor = (type) => {
  switch (type) {
    case 'detail':
      return 'blue'
    case 'add':
      return 'green'
    case 'remove':
      return 'red'
    default:
      return null
  }
}

export const getItemHeader = (type) => {
  switch (type) {
    case 'detail':
      return 'Detail Item'
    case 'add':
      return 'Add Item'
    case 'remove':
      return 'Remove Item'
    default:
      return 'Item'
  }
}
