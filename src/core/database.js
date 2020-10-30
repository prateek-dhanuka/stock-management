import { clean } from './utils'
import firestore from '@react-native-firebase/firestore'

/**
 *
 * @param {String} grade
 * @param {String} shape
 * @param {number} dia
 * @return {Object} Count, Weight and Estimated cost of particular variation
 */
export async function getSummary({ grade, shape, dia, loc, origin }) {
  if (
    grade === null &&
    shape === null &&
    dia === null &&
    loc === null &&
    origin === null
  ) {
    const overallSummary = await firestore()
      .collection('summary')
      .doc('overall')
      .get()

    return clean(overallSummary.data())
  } else {
    var query = firestore().collection('summary')
    if (grade !== null) {
      query = query.where('grade', '==', grade)
    }
    if (shape !== null) {
      query = query.where('shape', '==', shape)
    }
    if (dia !== null) {
      query = query.where('dia', '==', dia)
    }
    if (loc !== null) {
      query = query.where('loc', '==', loc)
    }
    if (origin !== null) {
      query = query.where('origin', '==', origin)
    }
    const summary = await query.get()
    if (summary.empty) {
      console.log(`Did not find summary for given filter`)
      return {
        cost: 0,
        count: 0,
        weight: 0,
      }
    } else {
      let summaryData = {
        cost: 0,
        count: 0,
        weight: 0,
      }
      summary.forEach((doc) => {
        const data = doc.data()
        summaryData.cost += data.cost
        summaryData.count += data.count
        summaryData.weight += data.weight
      })
      return clean(summaryData)
    }
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

  const batch = firestore().batch()

  // Increment overall summary
  batch.update(summaryRef, {
    count: firestore.FieldValue.increment(data.count),
    cost: firestore.FieldValue.increment(cost),
    weight: firestore.FieldValue.increment(weight),
  })

  // If data doesn't exist, create it
  if (dataRef === null) {
    const newDataRef = firestore().collection('data').doc()
    const newDataSummaryRef = firestore()
      .collection('summary')
      .doc(newDataRef.id)

    // Add the data and summary
    const { count, length, ...otherData } = data
    batch.set(newDataRef, { ...otherData, length: [length] })
    batch.set(newDataRef.collection('data').doc(`${length}`), { count })
    batch.set(newDataSummaryRef, { ...otherData, count, weight, cost })
  } else {
    // Data already exists, append to it

    // Update the length array,
    batch.update(dataRef, {
      length: firestore.FieldValue.arrayUnion(data.length),
    })

    // Add the counts as well
    const countRef = dataRef.collection('data').doc(`${data.length}`)
    const currentData = await countRef.get()
    if (!currentData.exists) {
      // Create it
      batch.set(countRef, { count: data.count })
    } else {
      // Update it
      batch.update(countRef, {
        count: firestore.FieldValue.increment(data.count),
      })
    }
    // Also update the summary
    batch.update(dataSummaryRef, {
      count: firestore.FieldValue.increment(data.count),
      cost: firestore.FieldValue.increment(cost),
      weight: firestore.FieldValue.increment(weight),
    })
  }
  batch.commit()
}

export async function removeItems(data) {
  // Reference to summary
  const summaryRef = firestore().collection('summary').doc('overall')
}

export async function findIdToRemove(data) {
  // Query to find the given data
  let query = firestore()
    .collection('data')
    .where('grade', '==', data.grade)
    .where('shape', '==', data.shape)
    .where('dia', '==', data.dia)
    .where('loc', '==', data.loc)
    .where('origin', '==', data.origin)
    .where('color', '==', data.color)
  if (data.cost !== 0) {
    // Only verify cost if it was given
    query = query.where('cost', '==', data.cost)
  }

  const dataQuery = await query.get()

  if (dataQuery.empty) {
    return null
  } else {
    // Check which ones can be used
    // and return details of all usable pieces
    let usableDocs = []

    dataQuery.forEach((doc) => {
      // Find the usable lengths
      const usableLengths = doc.data.length.filter(
        (length) =>
          data.length === -1 // If removing full lengths,
            ? length === -1 // Only full lengths can be used
            : length >= data.length || length === -1 // Else, larger and full pieces can be used
      )

      usableLengths.forEach(async (length) => {
        // Make sure there are enough counts to remove
        const lengthData = await doc.collection('data').doc(`${length}`).get()
        if (lengthData.data().count >= data.count) {
          usableDocs.push({ id: doc.id, cost: doc.data().cost, length: -1 })
        }
      })
    })

    return usableDocs
  }
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
