import Vue from 'vue'
import Vuex from 'vuex'
import chess from 'chess'
import * as firebaseui from 'firebaseui'
import { firebase, auth, database, messaging } from './firebase'
import { notationToIndex } from './chess'

export const SET_PLAYER_NAME = 'SET_PLAYER_NAME'
export const SET_PLAYER = 'SET_PLAYER'
export const UNSET_PLAYER = 'UNSET_PLAYER'
export const UPDATE_PLAYER_NAMES = 'UPDATE_PLAYER_NAMES'
export const SET_MESSAGE = 'SET_MESSAGE'
export const SET_SELECTED_SQUARE = 'SET_SELECTED_SQUARE'
export const ADD_MOVE = 'ADD_MOVE'
export const SET_GAME_ID = 'SET_GAME_ID'
export const UPDATE_MY_GAMES = 'UPDATE_MY_GAMES'
export const SET_LOADING = 'SET_LOADING'
export const SHOW_PLAYER_NAME_CONFIRMATION = 'SHOW_PLAYER_NAME_CONFIRMATION'

export const sw = {
  setPlayerToken(player) {
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
  updatePlayerGames(player, { state, commit }) {
    database.ref(`players/${state.playerId}/games`).on('value', (snapshot) => {
      const gameIds = snapshot.val() || {}
      const games = Object.keys(gameIds).filter(i => gameIds[i])
      games.forEach((gameId) => {
        database.ref(`games/${gameId}`).on('value', updateGames)

        function updateGames(snapshot) {
          const game = snapshot.val()
          return Promise.all([
            database.ref(`players/${game.white}/name`).once('value'),
            database.ref(`players/${game.black}/name`).once('value')
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
                database.ref(`games/${gameId}`).off('value', updateGames)
              }
            })
        }
      })
    })
  }
}

function sameSquare(a, b) {
  return a.file === b.file && a.rank === b.rank
}

export const actions = {
  loadGame({ commit, state }, gameId) {
    commit(SET_LOADING, true)
    // remove old listeners
    if (state.gameId) {
      database.ref(`moves/${state.gameId}`).off('child_added')
      database.ref(`players/${state.game.white}/name`).off('value')
      database.ref(`players/${state.game.black}/name`).off('value')
    }

    state.gameClient = chess.create({ PGN: true })
    state.moves = []

    database.ref(`moves/${gameId}`).on('child_added', (snapshot, prevKey) => {
      const move = snapshot.val()
      const lastMove = state.moves[state.moves.length - 1]
      commit(ADD_MOVE, move)
      commit(SET_SELECTED_SQUARE, null)
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

  joinTeam({ commit, state }, team) {
    database.ref(`games/${state.gameId}/${team}`).set(state.playerId)
    database.ref(`players/${state.playerId}/games/${state.gameId}`).set(true)
  },

  clickSquare({ commit, dispatch, state }, square) {
    if (!state.selected) {
      return
    }

    const index = notationToIndex(square)
    const { piece } = state.gameClient.getStatus().board.squares[index]
    const side = piece && piece.side.name

    const selectedIndex = notationToIndex(state.selected)
    const { piece: selectedPiece } = state.gameClient.getStatus().board.squares[selectedIndex]
    const selectedSide = selectedPiece && selectedPiece.side.name

    const sameTeam = side === selectedSide

    if (state.selected !== square) {
      dispatch('movePiece', square)
    }
  },
  selectSquare({ commit, dispatch, state }, selection) {
    if (!selection) {
      commit(SET_SELECTED_SQUARE, null)
      return
    }

    const status = state.gameClient.getStatus()
    const index = notationToIndex(selection)
    const square = status.board.squares[index]
    if (!square.piece) return

    const turn = state.moves.length % 2 === 0 ? 'white' : 'black'
    const selectionTeam = square.piece.side.name

    if (state.game[selectionTeam] === state.playerId) {
      if (turn === selectionTeam) {
        commit(SET_SELECTED_SQUARE, selection)
      }
    } else {
      dispatch('timedMessage', { message: 'Not your piece' })
    }
  },
  timedMessage({ commit }, { message, timeout = 2000 }) {
    commit(SET_MESSAGE, message)
    setTimeout(() => {
      commit(SET_MESSAGE, null)
    }, timeout)
  },
  movePiece({ commit, dispatch, state }, to) {
    if (!state.selected) {
      throw new Error('no piece selected')
    }

    const fromIndex = notationToIndex(state.selected)
    const toIndex = notationToIndex(to)

    const game = state.gameClient.getStatus()
    const squares = game.board.squares
    const move = {
      from: squares[fromIndex],
      to: squares[toIndex]
    }
    const validMove = Object.keys(game.notatedMoves).find((key) => {
      const notatedMove = game.notatedMoves[key]
      return (
        sameSquare(notatedMove.src, move.from) &&
        sameSquare(notatedMove.dest, move.to)
      )
    })

    if (validMove) {
      // commit(ADD_MOVE, validMove)
      commit(SET_SELECTED_SQUARE, null)
      commit(SET_MESSAGE, null)
      database.ref(`moves/${state.gameId}`).push(validMove)
    } else {
      commit(SET_SELECTED_SQUARE, null)
      dispatch('selectSquare', to)
    }
  }
}

// temp value to hold user data
let anonymousUser

export const playerActions = {
  requestPermission({ dispatch }) {
    messaging.requestPermission().then(() => {
      console.log('Notification permission granted.')
      dispatch('saveToken')
    }).catch((err) => {
      console.error('Unable to get permission to notify.', err)
    })
  },
  saveToken({ dispatch, state }, subscription) {
    // current defaults to firebase-messaging-sw
    // Firebase.messaging().useServiceWorker(registration)
    messaging.getToken().then((currentToken) => {
      if (currentToken) {
        console.log(currentToken)
        database.ref(`notificationTokens/${state.playerId}/${currentToken}`).set(true)
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
  revokeToken({ state }, subscription) {
    messaging.getToken().then((currentToken) => {
      if (currentToken) {
        database.ref(`notificationTokens/${state.playerId}/${currentToken}`).set(false)
      } else {
        console.warn('already unsubscribed')
      }
    })
  },

  setPlayer({ commit, dispatch, state }, player = {}) {
    commit(SET_PLAYER, {
      id: player.uid,
      // default from Firebase auth obj
      name: player.name || player.displayName,
      isAnonymous: player.isAnonymous
    })

    if (player.uid) {
      // commit('SHOW_PLAYER_NAME_CONFIRMATION')
      sw.setPlayerToken(player)
      sw.updatePlayerGames(player, { state, commit })
    }
  },
  setPlayerName({ commit, state }, name) {
    commit('SET_PLAYER_NAME', {
      name,
      playerId: state.playerId
    })
    database.ref(`players/${state.playerId}/name`).set(name)
  },
  signOut({ commit, state }) {
    auth.signOut()
    database.ref(`players/${state.playerId}/games`).off('value')
  },

  initLogins() {
    window.CLIENT_ID = '204431620450-27i4skt44d4k1flmhkdn7kf5vn425h9f.apps.googleusercontent.com'

    const firebaseuiConfig = {
      autoUpgradeAnonymousUsers: true,
      callbacks: {
        signInFailure(error) {
          if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve()
          }

          let data = {}
          const cred = error.credential
          const prevId = auth().currentUser.uid

          return database.ref(`players/${prevId}`).once('value').then((snapshot) => {
            data = snapshot.val() || {}
            return auth().signInWithCredential(cred)
          })
            .then((user) => {
              // TODO: filter inactive (value; false)
              const newId = user.uid
              const gameIds = Object.keys(data.games || {})
              const gameUpdates = updateGamesForPlayer(gameIds, prevId, newId)
              const teamUpdates = updatePlayersForGame(gameIds, prevId, newId)

              return Promise.all([
                ...gameUpdates,
                ...teamUpdates
              ])
            })
            .then(() => {
              return anonymousUser.delete()
            })
            .then(() => {
              data = {}
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
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Required to enable this provider in one-tap sign-up
          authMethod: 'https://accounts.google.com',
          clientId: window.CLIENT_ID
        },
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
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
  signInAnonymously() {
    auth.signInAnonymously()
  }
}

function gameById(gameId) {
  return database.ref(`games/${gameId}`).once('value').then(s => s.val())
}

function updateGamesForPlayer(gameIds, oldPlayerId, newPlayerId) {
  return gameIds.map((gameId) => {
    return database.ref(`players/${newPlayerId}/games/${gameId}`).set(true)
    return database.ref(`players/${oldPlayerId}/games/${gameId}`).set(false)
  })
}

function updatePlayersForGame(gameIds, oldPlayerId, newPlayerId) {
  return Promise.all(
    gameIds.map((gameId) => {
      return gameById(gameId).then((game) => {
        const { black, white } = game
        return Promise.all(
          Object.entries({ black, white }).map(([color, playerId]) => {
            if (playerId === oldPlayerId) {
              return database.ref(`games/${gameId}/${color}`).set(newPlayerId)
            }
            return Promise.resolve()
          })
        )
      })
    })
  )
}
