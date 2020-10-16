const functions = require('firebase-functions')

exports.helloWorld = functions.https.onCall((data, context) => {
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       'unauthenticated',
//       'Endpoint requires authentication!'
//     )
//   }
  functions.logger.info('Hello logs!', { structuredData: true })
  return 'Hey from Firebase!'
})
