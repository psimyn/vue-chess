import Firebase from 'firebase/api'

// const config = {
//   apiKey: 'AIzaSyDgo_wWAkKHmFxHMvDGFL4IUKfy0WNyJK4',
//   authDomain: 'chess-cfde8.firebaseapp.com',
//   databaseURL: 'https://chess-cfde8.firebaseio.com',
//   storageBucket: '',
// }
//
// Firebase.initializeApp(config)
// const database = Firebase.database()
//
// export const set = (path, value) => database.ref(path).set(value)
//
// export const on = (path, eventName, callback) => database.ref(path).on(eventName, callback)
// export const off = (path, eventName, callback) => database.ref(path).off(eventName, callback)

const database = {
  ref() {
    return {
      on() {},
      off() {},
    }
  }
}

export default database
