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
  if (
    params.grade !== null ||
    params.shape !== null ||
    params.dia !== null ||
    params.loc !== null ||
    params.origin !== null
  ) {
    header_text = ''
    if (params.dia !== null) {
      header_text += `${params.dia} `
    }
    if (params.grade !== null) {
      header_text += `${valid.grades[params.grade].text} `
    }
    if (params.shape !== null) {
      header_text += `${valid.shapes[params.shape].text}`
    }
    if (params.loc !== null) {
      header_text += `@${valid.locs[params.loc].text}`
    }
    if (params.origin !== null) {
      header_text += `(${valid.origins[params.origin].text})`
    }
    // header_text = header_text.slice(0, -1)
  }
  return header_text
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

export const clean = ({ cost, count, weight }) => {
  return {
    cost: Math.round(cost),
    count: Math.round(count),
    weight: Math.round(weight),
  }
}

export const getWeight = (data) => {
  const weight =
    ((data.dia * data.dia) / (data.shape === '0' ? 162000 : 127000)) * // 0 is round
    data.count *
    (data.length === -1 ? 6000 : data.length)
  // console.log(`Dia^2 = ${dia2}`)
  // console.log(`Weight Per meter = ${weightPerMeter}`)
  // console.log(
  //   `Weight for ${data.count} * Dia ${data.dia} ${data.shape} length ${data.length} is ${weight}`
  // )
  return weight
}
