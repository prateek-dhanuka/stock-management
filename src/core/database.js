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
  } else if (dataQuery.docs.length > 1) {
    console.log('Multiple docs found')
    // If more than one item found, check which ones can be used
    // and return ids of all found docs
    let usableDocs = []

    dataQuery.forEach((doc) => {
      const docData = doc.data()

      if (data.length === -1 && docData.count > 0) {
        console.log('Removing full length')
        // If removing full length, make sure there are full lengths to remove
        // When removing full length, the only way to find multiple docs is to have different costs
        usableDocs.push({ id: doc.id, cost: docData.cost, length: -1 })
      } else if (data.length !== -1) {
        console.log('Removing partial length')
        // If removing partial length, make sure there is a cut piece large enough
        for (const length of docData.length) {
          if (
            length >= data.length && // Make sure same length isn't duplicated
            !usableDocs.map((a) => a.length).includes(length)
          ) {
            usableDocs.push({
              id: doc.id,
              length: length,
              cost: docData.cost,
            })
          }
        }
        // Even full length can be used
        if (docData.count > 0) {
          usableDocs.push({
            id: doc.id,
            cost: docData.cost,
            length: -1,
          })
        }
      }
    })

    return usableDocs
  } else {
    console.log('Found single doc')
    // When only one document is found,
    // If removing cut piece, check if there are options
    // If removing full piece, return the document details as is
    if (data.length === -1) {
      console.log('Removing full length')
      return { id: dataQuery.docs[0].id }
    } else {
      console.log('Removing partial length')
      const docData = dataQuery.docs[0].data()
      let usableDocs = []

      for (const length of docData.length) {
        if (
          length >= data.length &&
          !usableDocs.map((a) => a.length).includes(length)
        ) {
          usableDocs.push({
            id: dataQuery.docs[0].id,
            length: length,
          })
        }
      }
      return usableDocs
    }
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
