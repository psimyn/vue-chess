import Vue from 'vue'
import Vuex from 'vuex'
import VuexFire from 'vuexfire'
import Firebase from 'firebase'
import chess from 'node-chess'

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
const playerRef = database.ref('players')

const playerId = localStorage.getItem('playerId') || playerRef.push().key
const gameId = document.location.hash.slice(1) || gameRef.push().key

// initial state
const state = {
  playerId,
  gameId,

  game: {
    players: {
      white: playerId,
      black: 'Player 2',
    },
    engine: chess.classic.engine(),
  },
  boardState: {},
  ranks: [],
  moves: [],
  selected: null,

  player: {
    name: 'Player 1',
    games: [],
  },
}

localStorage.setItem('playerId', state.playerId)
document.location.hash = `#${state.gameId}`

const chessActions = {
  setPlayer ({state}, color) {
    database.ref(`games/${state.gameId}/players/${color}`).set(state.playerId)
  },
  // todo: this should be 2 functions, and call the correct one
  // based on selected
  selectSquare ({commit, state}, square) {
    if (state.selected) {
      const move = {from: state.selected, to: square}
      state.game.engine.movePiece(move)
      // state.boardState = state.game.boardState
      // todo: this should not be here
      // and move should be auto-flattened or somethign
      database.ref(`games/${state.gameId}/moves`).push({
        from: {
          rank: move.from.rank,
          file: move.from.file,
        },
        to: {
          rank: move.to.rank,
          file: move.to.file,
        }
      })
      state.selected = null
    } else {
      state.selected = square
    }
  }
}

const playerActions = {
  setName ({state}, name) {
    database.ref(`players/${state.playerId}/name`).set(name)
  },
  addGame ({state}) {
    database.ref(`players/${state.playerId}/games`).push(state.gameId)
  },
}

export const store = new Vuex.Store({
  state,
  mutations: {
    ...VuexFire.mutations,
  },
  getters: {
    player: state => {
      return state.player
    },
    boardState: state => {
      state.game.engine = chess.classic.engine()
      state.moves.forEach((move) => {
        state.game.engine.movePiece(move)
      })
      return state.game.engine.boardState
    },
    selected: state => state.selected,
  },
  actions: {
    ...chessActions,
    ...playerActions,
  }
})

const chessBase = {
  moves: gameRef.child(`${state.gameId}/moves`),
  players: {
    source: gameRef.child(`${state.gameId}/players`),
    asObject: true,
  },
}

export const firebase = {
  game: {
    source: gameRef.child(state.gameId),
    asObject: true,
  },
  player: {
    source: database.ref(`players/${state.playerId}`),
    asObject: true,
  }
}
