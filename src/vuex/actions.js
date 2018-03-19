import Vue from 'vue'
import Vuex from 'vuex'
import chess from 'chess'
import Firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import { notationToIndex } from './chess'

const SET_PLAYER_NAME = 'SET_PLAYER_NAME'
const SET_PLAYER = 'SET_PLAYER'
const UNSET_PLAYER = 'UNSET_PLAYER'
const UPDATE_PLAYER_NAMES = 'UPDATE_PLAYER_NAMES'
const SET_MESSAGE = 'SET_MESSAGE'
const SET_SELECTED_SQUARE = 'SET_SELECTED_SQUARE'
const ADD_MOVE = 'ADD_MOVE'
const SET_GAME_ID = 'SET_GAME_ID'
const UPDATE_MY_GAMES = 'UPDATE_MY_GAMES'
const SET_LOADING = 'SET_LOADING'
const SHOW_PLAYER_NAME_CONFIRMATION = 'SHOW_PLAYER_NAME_CONFIRMATION'

const auth = () => Firebase.auth()
const db = () => Firebase.database()

export const sw = {
  setPlayerToken (player) {
    player.getIdToken().then((token) => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          command: 'setPlayerToken',
          message: {
            playerId: player.uid,
            token
          }
        })
      }
    })
  },
  updatePlayerGames (player, {state, commit}) {
    db().ref(`players/${state.playerId}/games`).on('value', (snapshot) => {
      const gameIds = snapshot.val() || {}
      const games = Object.keys(gameIds).filter(i => gameIds[i])
      games.forEach((gameId) => {
        db().ref(`games/${gameId}`).on('value', updateGames)

        function updateGames (snapshot) {
          const game = snapshot.val()
          return Promise.all([
            db().ref(`players/${game.white}/name`).once('value'),
            db().ref(`players/${game.black}/name`).once('value')
          ])
          .then(([white, black]) => {
            commit(UPDATE_PLAYER_NAMES, {
              [game.white]: white.val(),
              [game.black]: black.val()
            })
            commit(UPDATE_MY_GAMES, {
              gameId,
              white: white.val(),
              black: black.val()
            })
            if (state.players.white && state.players.black) {
              db().ref(`games/${gameId}`).off('value', updateGames)
            }
          })
        }
      })
    })
  }
}

export const actions = {
  loadGame ({commit, state}, gameId) {
    const database = Firebase.database()
    commit(SET_LOADING, true)
    // remove old listeners
    if (state.gameId) {
      database.ref(`moves/${state.gameId}`).off('child_added')
      database.ref(`players/${state.game.white}/name`).off('value')
      database.ref(`players/${state.game.black}/name`).off('value')
    }

    state.gameClient = chess.create({PGN: true})
    state.moves = []

    database.ref(`moves/${gameId}`).on('child_added', (snapshot) => {
      const move = snapshot.val()
      commit(ADD_MOVE, move)
      commit(SET_LOADING, false)
    })

    database.ref(`games/${gameId}`).on('value', (snapshot) => {
      const white = snapshot.child('white').val()
      const black = snapshot.child('black').val()

      state.game = {
        ...state.game,
        white,
        black
      }
      commit(SET_LOADING, false)
    })

    document.location.hash = gameId
    commit(SET_GAME_ID, gameId)
  },

  joinTeam ({commit, state}, team) {
    const database = Firebase.database()
    database.ref(`games/${state.gameId}/${team}`).set(state.playerId)
    database.ref(`players/${state.playerId}/games/${state.gameId}`).set(true)
  },

  clickSquare ({commit, dispatch, state}, sq) {
    const square = `${sq.file}${sq.rank}`
    const myPiece = false // sq.piece && sq.piece.side.name ===

    if (state.selected && !myPiece) {
      dispatch('movePiece', square)
    } else {
      dispatch('selectSquare', square)
    }
  },
  selectSquare ({commit, dispatch, state}, selection) {
    const status = state.gameClient.getStatus()
    const index = notationToIndex(selection)
    const square = status.board.squares[index]
    if (!square.piece) return

    const turn = state.moves.length % 2 === 0 ? 'white' : 'black'
    const selectionTeam = square.piece.side.name

    if (state.game[selectionTeam] === state.playerId) {
      if (turn === selectionTeam) {
        commit(SET_SELECTED_SQUARE, selection)
      } else {
        dispatch('timedMessage', {message: `It is ${turn}'s move`})
      }
    } else {
      dispatch('timedMessage', {message: 'Not your piece'})
    }
  },
  timedMessage ({commit}, {message, timeout = 2000}) {
    commit(SET_MESSAGE, message)
    setTimeout(() => {
      commit(SET_MESSAGE, null)
    }, timeout)
  },
  movePiece ({commit, dispatch, state}, to) {
    if (!state.selected) throw new Error('no piece selected')
    const fromIndex = notationToIndex(state.selected)
    const toIndex = notationToIndex(to)

    const game = state.gameClient.getStatus()
    const squares = game.board.squares
    const move = {
      from: squares[fromIndex],
      to: squares[toIndex]
    }
    // const move = moveAsPGNFromSquares(fromSquare, toSquare)
    // const validMove = Object.keys(game.notatedMoves).indexOf(move) > -1
    const validMove = Object.keys(game.notatedMoves).find((key) => {
      const notatedMove = game.notatedMoves[key]
      return notatedMove.src.file === move.from.file &&
        notatedMove.src.rank === move.from.rank &&
        notatedMove.dest.file === move.to.file &&
        notatedMove.dest.rank === move.to.rank
    })

    if (validMove) {
      db().ref(`moves/${state.gameId}`).push(validMove)
      commit(SET_MESSAGE, null)
      commit(SET_SELECTED_SQUARE, null)
    } else {
      dispatch('timedMessage', {message: 'Invalid move'})
      commit(SET_SELECTED_SQUARE, null)
    }
  }
}

// temp value to hold user data
let anonymousUser

export const playerActions = {
  requestPermission ({dispatch}) {
    Firebase.messaging().requestPermission().then(() => {
      console.log('Notification permission granted.')
      dispatch('saveToken')
    }).catch((err) => {
      console.error('Unable to get permission to notify.', err)
    })
  },
  saveToken ({dispatch, state}, subscription) {
    // current defaults to firebase-messaging-sw
    // Firebase.messaging().useServiceWorker(registration)
    Firebase.messaging().getToken().then((currentToken) => {
      if (currentToken) {
        console.log(currentToken)
        db().ref(`notificationTokens/${state.playerId}/${currentToken}`).set(true)
      } else {
        dispatch('requestPermission')
      }
    }).catch((err) => {
      console.error('Unable to get messaging token.', err)
      if (err.code === 'messaging/permission-default') {
        console.error('You have not enabled notifications on this browser. To enable notifications reload the page and allow notifications using the permission dialog.')
      } else if (err.code === 'messaging/notifications-blocked') {
        console.error('You have blocked notifications on this browser.')
      }
    })
  },
  revokeToken ({state}, subscription) {
    Firebase.messaging().getToken().then((currentToken) => {
      if (currentToken) {
        db().ref(`notificationTokens/${state.playerId}/${currentToken}`).set(false)
      } else {
        console.warn('already unsubscribed')
      }
    })
  },

  setPlayer ({commit, dispatch, state}, player = {}) {
    commit(SET_PLAYER, {
      id: player.uid,
      // default from Firebase auth obj
      name: player.name || player.displayName,
      isAnonymous: player.isAnonymous
    })

    if (player.uid) {
      // commit('SHOW_PLAYER_NAME_CONFIRMATION')
      sw.setPlayerToken(player)
      sw.updatePlayerGames(player, {state, commit})
    }
  },
  setPlayerName ({commit, state}, name) {
    commit('SET_PLAYER_NAME', {
      name,
      playerId: state.playerId
    })
    db().ref(`players/${state.playerId}/name`).set(name)
  },
  signOut ({commit, state}) {
    Firebase.auth().signOut()
    db().ref(`players/${state.playerId}/games`).off('value')
  },

  initLogins () {
    const firebaseuiConfig = {
      autoUpgradeAnonymousUsers: true,
      callbacks: {
        signInFailure (error) {
          if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve()
          }

          let data
          const cred = error.credential
          const id = auth().currentUser.uid

          return db().ref(`players/${id}`).once('value').then((snapshot) => {
            data = snapshot.val()
            return auth().signInWithCredential(cred)
          })
          .then((user) => {
            // TODO: filter inactive (value; false)
            let teamUpdates = []
            const gameUpdates = Object.keys(data.games).map((gameId) => {
              return db().ref(`games/${gameId}`).once('value').then((snapshot) => {
                const { black, white } = snapshot.val()
                if (black === id) {
                  teamUpdates.push(
                    db().ref(`games/${gameId}/black`).set(user.uid)
                  )
                }
                if (white === id) {
                  teamUpdates.push(
                    db().ref(`games/${gameId}/white`).set(user.uid)
                  )
                }
                return db().ref(`players/${user.uid}/games/${gameId}`).set(true)
              })
            })

            return Promise.all([
              ...gameUpdates,
              ...teamUpdates
            ])
          })
          .then(() => {
            return anonymousUser.delete();
          })
          .then(() => {
            data = null
            // TODO trigger sign in success logic
          })
          .catch((error) => {
            debugger
            console.error(error)
          })
        },
        signInSuccess(currentUser, credential, redirectUrl) {
          return false
        }
      },
      signInFlow: 'popup',
      signInOptions: [
        {
          provider: Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Required to enable this provider in one-tap sign-up
          authMethod: 'https://accounts.google.com',
          clientId: '204431620450-27i4skt44d4k1flmhkdn7kf5vn425h9f.apps.googleusercontent.com'
        },
        Firebase.auth.FacebookAuthProvider.PROVIDER_ID
      ],
      // Required to enable one-tap sign-up credential helper
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
      tosUrl: 'TODO'
    }

    const ui = new firebaseui.auth.AuthUI(auth())
    const currentUser = auth().currentUser

    if (currentUser.isAnonymous) {
      anonymousUser = currentUser
      ui.start('#firebaseui-auth-container', firebaseuiConfig)
    }
    ui.disableAutoSignIn()
  },
  signInAnonymously () {
    Firebase.auth().signInAnonymously()
  }
}

window.onGoogleYoloLoad = (googleyolo) => {
  // The 'googleyolo' object is ready for use.
  console.log(googleyolo)
};
