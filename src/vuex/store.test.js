import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import storeConfig from './store'
import { cloneDeep } from 'lodash'

jest.mock('./firebase', () => {
  var firebasemock = require('firebase-mock')

  var mockauth = new firebasemock.MockAuthentication()
  var mockdatabase = new firebasemock.MockFirebase()
  var mockfirestore = new firebasemock.MockFirestore()
  var mockstorage = new firebasemock.MockStorage()
  var mockmessaging = new firebasemock.MockMessaging()
  var mocksdk = new firebasemock.MockFirebaseSdk(
    // use null if your code does not use RTDB
    (path) => {
      return path ? mockdatabase.child(path) : mockdatabase
    },
    // use null if your code does not use AUTHENTICATION
    () => {
      return mockauth
    },
    // use null if your code does not use FIRESTORE
    () => {
      return mockfirestore
    },
    // use null if your code does not use STORAGE
    () => {
      return mockstorage
    },
    // use null if your code does not use MESSAGING
    () => {
      return mockmessaging
    }
  )

  const firebase = mocksdk.initializeApp()

  return {
    firebase,
    database: mockdatabase,
    auth: mockauth,
    messaging: mockmessaging
  }
})

// mocksdk.database().flush()

function createStore() {
  return new Vuex.Store(cloneDeep(storeConfig))
}

describe('store', function () {
  let store

  beforeEach(function () {
    store = createStore()
  })

  test('default values', function () {
    expect(store.state.gameId).toBeNull()
    expect(store.getters.game.isCheck).toBe(false)
    expect(store.getters.game.isCheckmate).toBe(false)
    expect(store.getters.game.isStalemate).toBe(false)
    expect(store.state.moves.length).toEqual(0)

  })

  test('add move', function () {
    expect(store.state.moves.length).toEqual(0)

    store.commit('ADD_MOVE', 'd3')

    expect(store.state.moves.length).toEqual(1)
    expect(store.state.moves).toEqual(['d3'])
  })

  test('request noti permission', function () {
    store.dispatch('requestPermission')

    expect()

  })
})
