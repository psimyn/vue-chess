import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'

const config = {
  apiKey: 'AIzaSyDgo_wWAkKHmFxHMvDGFL4IUKfy0WNyJK4',
  authDomain: 'chess-cfde8.firebaseapp.com',
  databaseURL: 'https://chess-cfde8.firebaseio.com',
  messagingSenderId: '204431620450',
  projectId: 'chess-cfde8'
}

firebase.initializeApp(config)

const auth = firebase.auth()
const database = firebase.database()
const messaging = firebase.messaging()

export {
  firebase,
  auth,
  database,
  messaging,
}




