import database from '@react-native-firebase/database'

export async function getData() {
  var typeSnapshot = await database().ref('/types').once('value')
  var tempData = []

  if (typeSnapshot.exists()) {
    const childArray = []
    typeSnapshot.forEach((child) => {
      childArray.push(child)
      return false
    })
    for (const child of childArray) {
      var typeVal = await child.val()

      var dataSnapshot = await database()
        .ref(`/data/${child.key}`)
        .once('value')

      if (dataSnapshot.exists()) {
        var dataVal = dataSnapshot.val()
      }

      if ('partial' in dataVal) {
        dataVal.partialCount = dataVal.partial.length
      } else {
        dataVal.partialCount = 0
      }

      tempData.push({
        key: child.key,
        shape: typeVal.shape,
        grade: typeVal.grade,
        dia: typeVal.dia,
        full: dataVal.full,
        partial: dataVal.partialCount,
      })
    }
  }
  return tempData
}

export async function uploadData(data) {
  var key = database().ref('/types').push().key

  database()
    .ref('/types')
    .child(key)
    .set({
      grade: data.grade,
      dia: data.dia.value,
      shape: data.shape,
    })
    .catch((error) => {
      console.error(error)
    })

  database()
    .ref('/data')
    .child(key)
    .set({
      full: 0,
      part: [],
    })
    .catch((error) => {
      console.error(error)
    })
}
