import Vue from 'vue'
import Vuex from 'vuex'
import chess from 'chess'
import Firebase from 'firebase'
import { notationToIndex } from './chess'
import { actions, playerActions } from './actions'

Vue.use(Vuex)

const config = {
  apiKey: 'AIzaSyDgo_wWAkKHmFxHMvDGFL4IUKfy0WNyJK4',
  authDomain: 'chess-cfde8.firebaseapp.com',
  databaseURL: 'https://chess-cfde8.firebaseio.com',
  messagingSenderId: '204431620450',
  projectId: "chess-cfde8"
}

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
      isAnonymous,
      games = []
    } = {}) {
    state.playerId = id
    Vue.set(state, 'player', {
      ...state.player,
      id,
      name,
      isAnonymous,
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
      store.dispatch('signInAnonymously')
    }
  })

}
