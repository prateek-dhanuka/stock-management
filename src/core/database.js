import firestore from '@react-native-firebase/firestore'

/**
 *
 * @param {String} grade
 * @param {String} shape
 * @param {number} dia
 * @return {Object} Count, Weight and Estimated cost of particular variation
 */
export function getSummary(grade, shape, dia) {
  //TODO: implement database functionality
  const count = Math.round(100 * Math.random())
  return {
    count: count,
    weight: 5 * count,
    cost: 40 * count,
  }
}

export async function addItems(data) {
  // Reference to summary
  const summaryRef = firestore().collection('summary').doc('overall')

  // Query to find if the given data already exists
  const dataSnapshot = await firestore()
    .collection('data')
    .where('grade', '==', data.grade)
    .where('shape', '==', data.shape)
    .where('dia', '==', data.dia)
    .where('loc', '==', data.loc)
    .where('cost', '==', data.cost)
    .where('origin', '==', data.origin)
    .where('color', '==', data.color)
    .get()

  var dataID = null
  if (!dataSnapshot.empty) {
    if (dataSnapshot.docs.length > 1) {
      console.error(
        `There are ${dataSnapshot.docs.length} items matching given data`
      )
      return
    }
    dataID = dataSnapshot.docs[0].id
  }

  // Create references if data exists
  const dataRef =
    dataID !== null ? firestore().collection('data').doc(dataID) : null
  const dataSummaryRef =
    dataID !== null ? firestore().collection('summary').doc(dataID) : null

  // Calculate summary data to add
  const weight =
    (data.count *
      Math.pow(data.dia, 2) *
      (data.length == -1 ? 6000 : data.length)) /
    (data.shape === 'round' ? 162000 : 127000)
  const cost = weight * data.cost

  return firestore().runTransaction(async (transaction) => {
    // If data already exists, get it
    const dataSnap = dataRef === null ? null : await transaction.get(dataRef)
    if (dataSnap !== null && !dataSnap.exists) {
      throw 'Data exists but is empty!'
    }

    // Increment overall Summary
    transaction.update(summaryRef, {
      count: firestore.FieldValue.increment(data.count),
      cost: firestore.FieldValue.increment(cost),
      weight: firestore.FieldValue.increment(weight),
    })

    // If data is null, create it
    if (dataRef === null) {
      const newDataRef = firestore().collection('data').doc()
      const newDataSummaryRef = firestore()
        .collection('summary')
        .doc(newDataRef.id)

      // Add data and summary
      transaction.set(newDataRef, {
        ...data,
        length: data.length === -1 ? [] : Array(data.count).fill(data.length),
        count: data.length === -1 ? data.count : 0,
      })
      transaction.set(newDataSummaryRef, {
        grade: data.grade,
        shape: data.shape,
        dia: data.dia,
        loc: data.loc,
        cost: data.cost,
        origin: data.origin,
        color: data.color,
        count: data.count,
        weight: weight,
        cost: cost,
      })
    } else {
      // Data already exists, append to it

      // If not a full length, append the new length to the data
      if (data.length != -1) {
        const length = dataSnap._data.length
        console.log(`Overall data: `, dataSnap)
        console.log(`Current lengths: `, dataSnap._data.length)
        for (var i = 0; i < data.count; ++i) {
          length.push(data.length)
        }
        transaction.update(dataRef, {
          length: length,
        })
      } else {
        // If a full length, add to the count
        transaction.update(dataRef, {
          count: firestore.FieldValue.increment(data.count),
        })
      }

      // Update the data summary as well
      transaction.update(dataSummaryRef, {
        count: firestore.FieldValue.increment(data.count),
        cost: firestore.FieldValue.increment(cost),
        weight: firestore.FieldValue.increment(weight),
      })
    }
  })
}

export function getCounts(grade, shape, dia, valid) {
  const origins = valid.origins
  const locs = valid.locs

  const output = { full: {}, partial: {} }
  Object.keys(origins).forEach((origin) => {
    output['full'][origin] = {}
    output['partial'][origin] = {}
    Object.keys(locs).forEach((loc) => {
      const full = Math.floor(10 * Math.random())
      const partial = Math.floor(10 * Math.random())
      for (let i = 0; i < partial; ++i) {
        output['partial'][origin][loc] = {
          length: Math.floor(6000 * Math.random()),
          count: Math.floor(10 * Math.random()),
        }
      }

      output['full'][origin][loc] = full
    })
  })

  return output
}

export function getGradeColor(grade, shape, valid) {
  const origins = valid.origins
  const colors = valid.colors

  const output = {}
  Object.keys(origins).forEach((origin) => {
    const keys = Object.keys(colors)
    output[origin] = colors[keys[Math.floor(Math.random() * keys.length)]]
  })

  return output
}
