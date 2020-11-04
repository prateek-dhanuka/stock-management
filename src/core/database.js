import analytics from '@react-native-firebase/analytics'
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
    // Log data to firebase
    await analytics().logEvent('summary', { grade, shape, dia, loc, origin })
    // .then(
    //   console.log(`Logged summary to firebase: `, {
    //     grade,
    //     shape,
    //     dia,
    //     loc,
    //     origin,
    //   })
    // )

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
  // Log data to firebase
  await analytics().logEvent('add', data)
  // .then(console.log(`Logged add to firebase: `, data))

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
  //Log data to firebase
  await analytics().logEvent('remove', data)
  // .then(console.log(`Logged remove to firebase: `, data))

  // Calculate summary data to remove
  const weight =
    (data.count *
      Math.pow(data.dia, 2) *
      (data.length == -1 ? 6000 : data.length)) /
    (data.shape === 'round' ? 162000 : 127000)
  const cost = weight * data.cost

  const batch = firestore().batch()

  // Decrement overall summary
  const overallRef = firestore().collection('summary').doc('overall')
  batch.update(overallRef, {
    count: firestore.FieldValue.increment(-data.count),
    cost: firestore.FieldValue.increment(-cost),
    weight: firestore.FieldValue.increment(-weight),
  })

  // Decrement data and summary
  const dataRef = firestore()
    .collection('data')
    .doc(data.id)
    .collection('data')
    .doc(`${data.length}`)
  batch.update(dataRef, {
    count: firestore.FieldValue.increment(-data.count),
  })
  const summaryRef = firestore().collection('summary').doc(data.id)
  batch.update(summaryRef, {
    count: firestore.FieldValue.increment(-data.count),
    cost: firestore.FieldValue.increment(-cost),
    weight: firestore.FieldValue.increment(-weight),
  })

  batch.commit()
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

    await Promise.all(
      dataQuery.docs.map(async (doc) => {
        // Find the usable lengths
        const usableLengths = doc.data().length.filter(
          (length) =>
            data.length === -1 // If removing full lengths,
              ? length === -1 // Only full lengths can be used
              : length >= data.length || length === -1 // Else, larger and full pieces can be used
        )

        await Promise.all(
          usableLengths.map(async (length) => {
            const lengthData = await doc.ref
              .collection('data')
              .doc(`${length}`)
              .get()

            if (lengthData.data().count >= data.count) {
              usableDocs.push({
                ...data,
                id: doc.id,
                cost: doc.data().cost,
                length: length,
              })
            }
          })
        )
      })
    )

    return usableDocs
  }
}

export async function getDetails(grade, shape, dia) {
  // Log data to firebase
  await analytics().logEvent('detail', { grade, shape, dia })
  // .then(console.log(`Logged detail to firebase: `, { grade, shape, dia }))

  const dataSnap = await firestore()
    .collection('data')
    .where('grade', '==', grade)
    .where('shape', '==', shape)
    .where('dia', '==', dia)
    .get()

  const output = { full: [], partial: [], color: [] }
  for (const doc of dataSnap.docs) {
    const data = doc.data()
    const origin = data.origin
    const color = data.color
    const lengths = data.length
    const loc = data.loc
    await Promise.all(
      lengths.map(async (length) => {
        const count = (
          await doc.ref.collection('data').doc(`${length}`).get()
        ).data().count

        if (length == -1) {
          output.full.push({ origin, loc, color, count })
        } else {
          output.partial.push({ origin, loc, color, count, length })
        }
      })
    )
    // if (output.color[origin] === undefined) {
    //   output.color[origin] = [color]
    // } else {
    //   output.color[origin] = [...new Set([...output.color[origin], color])]
    // }
    if (
      output.color.filter((e) => e.origin === origin && e.color === color)
        .length <= 0
    ) {
      output.color.push({ origin, color })
    }
  }

  return output
}
