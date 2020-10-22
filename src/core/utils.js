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

export const getSummaryHeader = (params, valid) => {
  var header_text = 'Summary'
  if (params.grade !== null || params.shape !== null || params.dia !== null) {
    header_text = ''
    if (params.dia != null) {
      header_text += `${params.dia} `
    }
    if (params.grade != null) {
      header_text += `${valid.grades[params.grade].text} `
    }
    if (params.shape != null) {
      header_text += `${valid.shapes[params.shape].text}`
    }
    // header_text = header_text.slice(0, -1)
  }
  return header_text
}

export const getItemScreenColor = (type) => {
  switch (type) {
    case 'detail':
      return '#1f00a3'
    case 'add':
      return '#008710'
    case 'remove':
      return '#791b1e'
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
