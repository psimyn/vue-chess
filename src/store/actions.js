import Vue from 'vue'
import Vuex from 'vuex'
import chess from 'chess'
import { firebase, auth, database, messaging } from './firebase'
import * as firebaseui from 'firebaseui'
import { notationToIndex } from './chess'
import {
  SET_PLAYER_NAME,
  SET_PLAYER,
  SET_PLAYER_NAME_BY_ID,
  UNSET_PLAYER,
  UPDATE_PLAYER_NAMES,
  SET_MESSAGE,
  SET_SELECTED_SQUARE,
  ADD_MOVE,
  SET_CURRENT_MOVE,
  SET_GAME_ID,
  UPDATE_MY_GAMES,
  SET_LOADING,
  SET_LOADING_GAMES,
  SHOW_PLAYER_NAME_CONFIRMATION
} from './mutation-types';

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
  }
}

function sameSquare(a, b) {
  return a.file === b.file && a.rank === b.rank
}

export const actions = {
  addMoves({ commit }, moves) {
    3
    moves.forEach(move => commit(ADD_MOVE, move))
  },

  setCurrentMove({ commit }, index) {
    commit(SET_CURRENT_MOVE, index)
  },

  loadGame({ commit, dispatch, state }, gameId) {
    commit(SET_LOADING, true)

    // remove old listeners
    if (state.gameId) {
      database.ref(`moves/${state.gameId}`).off('child_added')
      database.ref(`players/${state.game.white}/name`).off('value')
      database.ref(`players/${state.game.black}/name`).off('value')
    }

    state.moves = []

    database.ref(`moves/${gameId}`).on('child_added', (snapshot, prevKey) => {
      const move = snapshot.val()
      const lastIndex = Math.max(0, state.moves.length - 1)
      const lastMove = state.moves[lastIndex]
      if (lastMove !== move) {
        commit(ADD_MOVE, move)
        commit(SET_SELECTED_SQUARE, null)
        dispatch('setCurrentMove', state.moves.length)
      }
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

  updatePlayerIfNeeded({ commit, state }, id) {
    const name = state.players[id]
    if (!name) {
      commit(SET_PLAYER_NAME_BY_ID, {
        id,
        name: '...'
      })
      return database.ref(`players/${id}/name`)
        .once('value')
        .then(snapshot => {
          commit(SET_PLAYER_NAME_BY_ID, {
            id,
            name: snapshot.val()
          })
        })
    }
    return Promise.resolve()
  },

  updateGame({ commit, dispatch, state }, snapshot) {
    const gameId = snapshot.key
    const { black: blackPlayerId, white: whitePlayerId } = snapshot.val()
    return Promise.all([
      dispatch('updatePlayerIfNeeded', blackPlayerId),
      dispatch('updatePlayerIfNeeded', whitePlayerId)
    ]).then(() => {
      commit(UPDATE_MY_GAMES, {
        gameId,
        white: state.players[whitePlayerId],
        black: state.players[blackPlayerId]
      })
    })
  },

  updatePlayerGames({ state, commit, dispatch }) {
    database.ref(`players/${state.playerId}/games`).on('value', (snapshot) => {
      const gameIds = snapshot.val() || {}
      const games = Object.keys(gameIds).filter(i => gameIds[i])
      Promise.all(
        games.map((gameId) => {
          return new Promise((resolve) => {
            database.ref(`games/${gameId}`).on('value', snapshot => {
              dispatch('updateGame', snapshot).then(resolve)
            })
          })
        })
      ).then(() => {
        commit(SET_LOADING_GAMES, false)
      })
    })
  },

  joinTeam({ state }, team) {
    database.ref(`games/${state.gameId}/${team}`).set(state.playerId)
    database.ref(`players/${state.playerId}/games/${state.gameId}`).set(true)
  },

  clickSquare({ dispatch, state, getters }, square) {
    if (!state.selected) {
      return
    }

    if (!square) {
      return
    }

    const index = notationToIndex(square)
    const { piece } = getters.gameStatus.board.squares[index]
    const side = piece && piece.side.name

    const selectedIndex = notationToIndex(state.selected)
    const { piece: selectedPiece } = getters.gameStatus.board.squares[selectedIndex]
    const selectedSide = selectedPiece && selectedPiece.side.name

    const sameTeam = side === selectedSide

    if (state.selected !== square) {
      dispatch('movePiece', square)
    }
  },
  selectSquare({ commit, dispatch, state, getters }, selection) {
    if (!selection) {
      commit(SET_SELECTED_SQUARE, null)
      return
    }

    const status = getters.gameStatus
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
  movePiece({ commit, dispatch, state, getters }, to) {
    if (!state.selected) {
      throw new Error('no piece selected')
    }

    const fromIndex = notationToIndex(state.selected)
    const toIndex = notationToIndex(to)

    const game = getters.gameStatus
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
      commit(ADD_MOVE, validMove)
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
          const prevId = auth.currentUser.uid

          return database.ref(`players/${prevId}`).once('value').then((snapshot) => {
            data = snapshot.val() || {}
            return auth.signInWithCredential(cred)
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
              if (anonymousUser) {
                return anonymousUser.delete()
              }
            })
            .then(() => {
              data = {}
              // TODO trigger sign in success logic
            })
            .catch((error) => {
              console.error(error)
            })
        },
        signInSuccess(currentUser, credential, redirectUrl) {
          if (currentUser.isAnonymous) {
            anonymousUser = currentUser
          }
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

    if (!this.ui) {
      this.ui = new firebaseui.auth.AuthUI(auth)
    }

    this.ui.start('#firebaseui-auth-container', firebaseuiConfig)
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
