const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

exports.helloWorld = functions.database
  .ref('/data/{data_id}')
  .onWrite((change) => {
    const data = change.after.val()

    if (data) {
      // The received data
      // console.log(`Retrieved data content: `, data)

      const weight =
        (data.count *
          Math.pow(data.dia, 2) *
          (data.length === -1 ? 6000 : data.length)) /
        (data.shape === 'round' ? 162000 : 127000)
      const cost = weight * (data.cost ? data.cost : 0)

      // Get the current summary to add to
      let summary = {}

      admin
        .database()
        .ref('/summary')
        .once('value', (snapshot) => {
          // Current summary
          summary = snapshot.val()
          // console.log(`Current summary: `, summary)

          // Add the current data
          summary.count += data.count
          summary.weight += weight
          summary.cost += cost

          // Set the new summary
          return admin.database().ref('/summary').set(summary)
        })
    }
  })
