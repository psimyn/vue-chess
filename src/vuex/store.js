import Vue from 'vue'
import Vuex from 'vuex'
import chess from 'chess'
import Firebase from 'firebase'
import { notationToIndex } from './chess'

Vue.use(Vuex)

const config = {
  apiKey: 'AIzaSyDgo_wWAkKHmFxHMvDGFL4IUKfy0WNyJK4',
  authDomain: 'chess-cfde8.firebaseapp.com',
  databaseURL: 'https://chess-cfde8.firebaseio.com',
  messagingSenderId: '204431620450'
}
// todo: fake db for mocha tests
let database = {}
let gameId = null
if (typeof window !== 'undefined') {
  Firebase.initializeApp(config)
  database = Firebase.database()
}

export const initialState = {
  // game meta
  gameId,
  game: {white: null, black: null},
  players: {},

  // game state
  gameClient: chess.create({PGN: true}),
  moves: [],

  // player
  playerId: null,
  player: {
    id: null,
    name: 'Guest',
    games: {}
  },

  // ui
  loading: true,
  selected: null,
  message: null
}

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

export const mutations = {
  [SET_LOADING] (state, val) {
    state.loading = val
  },
  [SET_MESSAGE] (state, message) {
    state.message = message
  },
  [SET_SELECTED_SQUARE] (state, selection) {
    state.selected = selection
  },
  [ADD_MOVE] (state, move) {
    // todo: should this error instead?
    if (move) {
      state.moves = state.moves.concat(move)
    }
  },

  [SET_GAME_ID] (state, gameId) {
    state.gameId = gameId
  },
  [UPDATE_MY_GAMES] (state, {gameId, white, black}) {
    const game = state.player.games[gameId] || {}
    game['white'] = white || game.white
    game['black'] = black || game.black
    state.player.games = {
      ...state.player.games,
      [gameId]: game
    }
  },
  [UPDATE_PLAYER_NAMES] (state, players) {
    state.players = {
      ...state.players,
      ...players
    }
  },

  [SET_PLAYER] (
    state,
    {
      id,
      name,
      games = []
    } = {}) {
    state.playerId = id
    Vue.set(state, 'player', {
      ...state.player,
      id,
      name,
      games
    })
  },
  [SET_PLAYER_NAME] (state, {name, playerId}) {
    state.player.name = name
    state.players = {
      ...state.players,
      [playerId]: name
    }
  }
}

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
    database.ref(`players/${state.playerId}/games`).on('value', (snapshot) => {
      const gameIds = snapshot.val() || {}
      const games = Object.keys(gameIds).filter(i => gameIds[i])
      games.forEach(gameId => {
        database.ref(`games/${gameId}`).on('value', updateGames)

        function updateGames (snapshot) {
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

export const actions = {
  loadGame ({commit, state}, gameId) {
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
      database.ref(`moves/${state.gameId}`).push(validMove)
      commit(SET_MESSAGE, null)
      commit(SET_SELECTED_SQUARE, null)
    } else {
      dispatch('timedMessage', {message: 'Invalid move'})
      commit(SET_SELECTED_SQUARE, null)
    }
  }
}

const playerActions = {
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
        Firebase.database().ref(`notificationTokens/${state.playerId}/${currentToken}`).set(true)
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
        Firebase.database().ref(`notificationTokens/${state.playerId}/${currentToken}`).set(false)
      } else {
        console.warn('already unsubscribed')
      }
    })
  },

  setPlayer ({commit, dispatch, state}, player = {}) {
    commit(SET_PLAYER, {
      id: player.uid,
      // default from Firebase auth obj
      name: player.name || player.displayName
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
    database.ref(`players/${state.playerId}/name`).set(name)
  },
  signOut ({commit, state}) {
    Firebase.auth().signOut()
    database.ref(`players/${state.playerId}/games`).off('value')
  },
  signInWithGoogle () {
    const provider = new Firebase.auth.GoogleAuthProvider()
    Firebase.auth().signInWithPopup(provider)
  },
  signInAnonymously () {
    Firebase.auth().signInAnonymously()
  }
}

export const store = new Vuex.Store({
  state: initialState,
  mutations,
  actions: {
    ...actions,
    ...playerActions
  },
  getters: {
    loading: state => state.loading,
    player: state => {
      return {
        ...state.player,
        id: state.playerId
      }
    },
    game: state => {
      const { isCheck, isCheckmate, isStalemate } = state.gameClient.getStatus()
      return {
        ...state.game,
        isCheck,
        isCheckmate,
        isStalemate
      }
    },
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
    }
  }
})

// todo: move this to created in App.vue or something
if (typeof window !== 'undefined') {
  gameId = document.location.hash.slice(1) || database.ref('games').push().key
  store.dispatch('loadGame', gameId)
  Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      database.ref(`players/${user.uid}`).on('value', (snapshot) => {
        const DEFAULT_NAME = 'Guest'
        const userInfo = snapshot.val() || {}
        user.name = userInfo.name || DEFAULT_NAME
        store.dispatch('setPlayer', user)
      })
    } else {
      database.ref(`players/${store.getters.player.id}`).off('value')
      store.dispatch('setPlayer')
    }
  })
}
