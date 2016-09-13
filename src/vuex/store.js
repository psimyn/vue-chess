import Vue from 'vue'
import Vuex from 'vuex'
import VuexFire from 'vuexfire'
import Firebase from 'firebase'
import chess from 'chess'

Vue.use(Vuex)
Vue.use(VuexFire)

const config = {
  apiKey: "AIzaSyDgo_wWAkKHmFxHMvDGFL4IUKfy0WNyJK4",
  authDomain: "chess-cfde8.firebaseapp.com",
  databaseURL: "https://chess-cfde8.firebaseio.com",
  storageBucket: "",
};

Firebase.initializeApp(config);
const database = Firebase.database()
const gameRef = database.ref('games')

const playerId = null
const gameId = document.location.hash.slice(1) || gameRef.push().key
document.location.hash = `#${gameId}`
if (navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.postMessage({
    command: 'setGameId',
    message: {
      gameId
    }
  })
}
const moves = []
const players = {white: null, black: null}
const gameClient = chess.create({PGN: true})

const gameState = {
  gameId,
  gameClient,
  moves,
  players,
}

// initial state
const state = {
  ...gameState,

  loading: true,
  selected: null,
  message: '',

  playerId,
  player: {},
}

const chessActions = {
  setPlayer ({state}, color) {
    state.players[color] = state.playerId
    database.ref(`games/${state.gameId}/players/${color}`).set(state.playerId)
  },
  setCurrentMove ({}, move) {
    state.currentMove = move
  },
  // todo: this should be 2 functions, and call the correct one
  // based on selected
  selectSquare ({dispatch, commit, state}, square) {
    dispatch('setCurrentMove', state.moves.length)
    state.message = null
    if (state.selected) {
      const move = {
        from: {
          rank: state.selected.rank,
          file: state.selected.file,
        },
        to: {
          rank: square.rank,
          file: square.file,
        }
      }
      // if valid move, do stuff
      const notatedMoves = state.gameClient.getStatus().notatedMoves
      const validMove = Object.keys(notatedMoves).find((key) => {
        const notatedMove = notatedMoves[key]
        return notatedMove.src.file === move.from.file &&
          notatedMove.src.rank === move.from.rank &&
          notatedMove.dest.file === move.to.file &&
          notatedMove.dest.rank === move.to.rank
      })

      if (validMove) {
        state.gameClient.move(validMove)
        state.currentMove += 1
        database.ref(`games/${state.gameId}/moves`).push({
          pge: validMove,
        })
        const theOtherGuy = state.players[(square.piece.side.name === 'white' ? 'black' : 'white')]
        database.ref(`turns`).push({
          playerId: theOtherGuy,
          gameId: state.gameId,
        })
      } else {
        state.message = 'Invalid move'
      }
      state.selected = null
    } else {
      // no piece, can't select
      if (!square.piece) return

      const turn = state.moves.length % 2 === 0 ? 'white' : 'black'
      if (state.playerId === state.players[turn.toLowerCase()]) {
        if (turn === square.piece.side.name) {
          state.selected = square
        } else {
          state.message = `It is ${turn}'s move`
        }
      } else {
        state.message = 'Not your piece'
      }
    }
    window.setTimeout(() => {
      state.message = null
    }, 3000)
  }
}

const playerActions = {
  subscribe ({state}, subscription) {
    const endpoint = subscription.endpoint.split('https://android.googleapis.com/gcm/send/')[1] || subscription.endpoint
    database.ref(`subscriptions/${state.playerId}/${endpoint}`).set(true)
  },
  unsubscribe ({state}, subscription) {
    const endpoint = subscription.endpoint.split('https://android.googleapis.com/gcm/send/')[1] || subscription.endpoint
    database.ref(`subscriptions/${state.playerId}/${endpoint}`).set(false)
  },
  setPlayerId ({state}, player) {
    if (player) {
      state.playerId = player.uid
      state.player = {
        ...state.player,
        photoUrl: player.photoUrl,
        name: player.displayName,
      }
    } else {
      state.playerId = null
    }
  },
  signOut ({dispatch}) {
    Firebase.auth().signOut()
    dispatch('setPlayerId')
  },
  signInWithGoogle ({dispatch, state}) {
    const provider = new Firebase.auth.GoogleAuthProvider()
    Firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const token = result.credential.accessToken
      dispatch('setPlayerId', result.user)
    })
    .catch((error) => {
      console.warn(error)
    })
  },
}

export const store = new Vuex.Store({
  state,
  mutations: {
    ...VuexFire.mutations,
  },
  actions: {
    ...chessActions,
    ...playerActions,
    firebaseLoaded ({state}) {
      state.loading = false
    }
  },
  getters: {
    loading: state => state.loading,
    player: state => {
      return {
        ...state.player,
        id: state.playerId,
      }
    },
    game: state => ({
      id: state.gameId,
      players: state.players,
      isCheck: state.gameClient.getStatus().isCheck,
      isCheckmate: state.gameClient.getStatus().isCheckmate,
    }),
    message: state => state.message,
    moves: state => state.moves,
    currentMove: state => state.currentMove,
    selected: state => state.selected,
    board: state => {
      state.gameClient = chess.create({PGN: true})
      state.moves.forEach((move, index) => {
        if (index > state.currentMove) return
        state.gameClient.move(move.pge)
      })
      return state.gameClient.getStatus().board
    },
  },
})


Firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch('setPlayerId', user)
    user.getToken().then((token) => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          command: 'setPlayerToken',
          message: {
            playerId: user.uid,
            token,
          }
        })
      }
    })
  } else {
    // no user signed in
  }
})

gameRef.once('value', (snapshot) => {
  store.dispatch('firebaseLoaded')
})

export const firebase = {
  moves: gameRef.child(`${state.gameId}/moves`),
  players: {
    source: gameRef.child(`${state.gameId}/players`),
    asObject: true,
  },
  player: {
    source: database.ref(`players/${state.playerId}`),
    asObject: true,
  }
}
