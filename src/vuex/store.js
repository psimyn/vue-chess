import Vue from 'vue'
import Vuex from 'vuex'
import chess from 'chess'
import VuexFire from 'vuexfire'

import Firebase from 'firebase'
const config = {
  apiKey: 'AIzaSyDgo_wWAkKHmFxHMvDGFL4IUKfy0WNyJK4',
  authDomain: 'chess-cfde8.firebaseapp.com',
  databaseURL: 'https://chess-cfde8.firebaseio.com',
  storageBucket: '',
}
// todo: fake db for mocha tests
let database = {}
let gameId = null
if (typeof window !== 'undefined') {
  Firebase.initializeApp(config)
  database = Firebase.database()
}

import { notationToIndex, moveAsPGNFromSquares } from './chess'

Vue.use(Vuex)

export const initialState = {
  gameId,
  gameClient: chess.create({PGN: true}),
  game: {white: null, black: null},
  players: {},
  moves: [],

  loading: true,
  selected: null,
  message: null,

  playerId: null,
  player: {
    id: null,
    games: {},
  },
}

export const SET_PLAYER_NAME = 'SET_PLAYER_NAME'
export const SET_MESSAGE = 'SET_MESSAGE'
export const SET_SELECTED_SQUARE = 'SET_SELECTED_SQUARE'
export const ADD_MOVE = 'ADD_MOVE'
export const SET_GAME_ID = 'SET_GAME_ID'
export const UPDATE_MY_GAMES = 'UPDATE_MY_GAMES'

export const mutations = {
  [SET_GAME_ID](state, gameId) {
    state.gameId = gameId
  },
  [UPDATE_MY_GAMES](state, {gameId, white, black}) {
    const game = state.player.games[gameId] || {}
    game['white'] = white || game.white
    game['black'] = black || game.black
    state.player.games = {
      ...state.player.games,
      [gameId]: game,
    }
  },
  [SET_MESSAGE](state, message) {
    state.message = message
  },
  [SET_SELECTED_SQUARE](state, selection) {
    state.selected = selection
  },
  [ADD_MOVE](state, move) {
    // todo: should this error instead?
    if (move) {
      state.moves = state.moves.concat(move)
    }
  },
  [SET_PLAYER_NAME](state, {name, playerId}) {
    state.players = {
      ...state.players,
      [playerId]: name,
    }
    if (playerId === state.playerId) {
      state.player.name = name
    }
  },
}

export const actions = {
  loadGame({commit, state}, gameId) {
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
    })

    database.ref(`games/${gameId}`).on('value', (snapshot) => {
      const key = snapshot.key
      const white = snapshot.child('white').val()
      const black = snapshot.child('black').val()

      state.game = {
        ...state.game,
        white,
        black,
      }

      database.ref(`players/${state.game.white}/name`).on('value', (snapshot) => {
        const name = snapshot.val()
        const playerId = state.game.white
        commit(SET_PLAYER_NAME, {
          name,
          playerId,
        })
      })

      database.ref(`players/${state.game.black}/name`).on('value', (snapshot) => {
        const name = snapshot.val()
        const playerId = state.game.black
        commit(SET_PLAYER_NAME, {
          name,
          playerId,
        })
      })
    })

    document.location.hash = gameId
    commit(SET_GAME_ID, gameId)
  },
  joinTeam({commit, state}, team) {
    database.ref(`games/${state.gameId}/${team}`).set(state.playerId)
    database.ref(`players/${state.playerId}/games/${state.gameId}`).set(true)
  },
  selectSquare({commit, state}, selection) {
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
        commit(SET_MESSAGE, `It is ${turn}'s move`)
      }
    } else {
      commit(SET_MESSAGE, 'Not your piece')
    }
  },
  movePiece({commit, state}, to) {
    if (!state.selected) throw 'no piece selected'
    const fromIndex = notationToIndex(state.selected)
    const toIndex = notationToIndex(to)

    const game = state.gameClient.getStatus()
    const squares = game.board.squares
    const move = {
      from: squares[fromIndex],
      to: squares[toIndex],
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
      database.ref(`moves/${state.gameId}`).push(validMove)
      commit(SET_SELECTED_SQUARE, null)
      commit(SET_MESSAGE, null)
    } else {
      commit(SET_MESSAGE, 'Invalid move')
    }
  }
}

const playerActions = {
  subscribe ({state}, subscription) {
    if (!state.playerId) throw 'missing playerId'
    const endpoint = subscription.endpoint.split('https://android.googleapis.com/gcm/send/')[1] || subscription.endpoint
    database.ref(`subscriptions/${state.playerId}/${endpoint}`).set(true)
  },
  unsubscribe ({state}, subscription) {
    if (!state.playerId) throw 'missing playerId'
    const endpoint = subscription.endpoint.split('https://android.googleapis.com/gcm/send/')[1] || subscription.endpoint
    database.ref(`subscriptions/${state.playerId}/${endpoint}`).set(false)
  },
  setPlayerId ({commit, state}, player) {
    if (player) {
      state.playerId = player.uid
      state.player = {
        ...state.player,
        photoUrl: player.photoUrl,
        name: player.displayName,
      }
      database.ref(`players/${state.playerId}/games`).on('value', (snapshot) => {
        const gameIds = snapshot.val() || {}
        const games = Object.keys(gameIds).filter(i => gameIds[i])
        games.forEach(gameId => {
          database.ref(`games/${gameId}`).once('value', (snap) => {
            const game = snap.val()
            database.ref(`players/${game.white}/name`).once('value', (snap) => {
              const name = snap.val()
              commit(UPDATE_MY_GAMES, {
                gameId,
                white: name,
              })
            })
            database.ref(`players/${game.black}/name`).once('value', (snap) => {
              const name = snap.val()
              commit(UPDATE_MY_GAMES, {
                gameId,
                black: name,
              })
            })
          })
        })
      })
    } else {
      database.ref(`players/${state.playerId}/games`).off('value')
      state.playerId = null
      state.playerGames = []
    }
  },
  setPlayerName({commit, state}, name) {
    const playerId = state.playerId
    database.ref(`players/${playerId}/name`).set(name)
    commit(SET_PLAYER_NAME, {
      name,
      playerId,
    })
  },
  signOut ({dispatch}) {
    Firebase.auth().signOut()
    // signOut doesn't fire authChanged
    dispatch('setPlayerId')
  },
  signInWithGoogle ({dispatch, state}) {
    const provider = new Firebase.auth.GoogleAuthProvider()
    Firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log(`logged in as ${result.user}`)
    })
    .catch((error) => {
      console.warn(error)
    })
  },
  signInAnonymously({}) {
    Firebase.auth().signInAnonymously().then((result) => {
      console.log(`logged in as ${result.uid}`)
    })
    .catch((error) => {
      console.warn(error)
    })
  }
}

export const store = new Vuex.Store({
  state: initialState,
  mutations,
  actions: {
    ...actions,
    ...playerActions,
  },
  getters: {
    loading: state => false, //state.loading,
    player: state => {
      return {
        ...state.player,
        id: state.playerId,
      }
    },
    playerGames: state => state.playerGames,
    game: state => state.game,
    players: state => state.players,
    message: state => state.message,
    moves: state => state.moves,
    currentMove: state => state.currentMove,
    selected: state => state.selected,
    board: state => {
      state.gameClient = chess.create({PGN: true})
      state.moves.forEach((move, index) => {
        if (index > state.currentMove) return
        state.gameClient.move(move)
      })
      return state.gameClient.getStatus().board
    },
  },
})

// todo: move this to created in App.vue or something
if (typeof window !== 'undefined') {
  gameId = document.location.hash.slice(1) || database.ref('games').push().key
  store.dispatch('loadGame', gameId)

  Firebase.auth().onAuthStateChanged((user) => {
    // playerRef.set({}) and append gameId
    if (user) {
      store.dispatch('setPlayerId', user)
      user.getToken().then((token) => {
        // todo: bring this back
        if (false && navigator.serviceWorker.controller) {
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
    }
  })
}
