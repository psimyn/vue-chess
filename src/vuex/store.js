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


// initial state
const state = {
  game: chess.classic.engine(),
  boardState: {},
  gameId: null,
  ranks: [],
  moves: [],
  selected: null,
}

const gameId = document.location.hash.slice(1) || database.ref('games').push().key
document.location.hash = `#${gameId}`

const playerId = localStorage.getItem('playerId') || database.ref('users').push().key
localStorage.setItem('playerId', playerId)
// database.ref(`users/${playerId}/games`).push(gameId)

export const store = new Vuex.Store({
  state,
  mutations: VuexFire.mutations,
  getters: {
    boardState: state => {
      state.game = chess.classic.engine()
      state.moves.forEach((move) => {
        state.game.movePiece(move)
      })
      return state.game.boardState
    },
    moves: state => state.moves,
    selected: state => state.selected,
  },
  actions: {
    // todo: this should be 2 functions, and call the correct one
    // based on selected
    selectSquare ({commit, state}, square) {
      if (state.selected) {
        const move = {from: state.selected, to: square}
        state.game.movePiece(move)
        // todo: this should not be here
        // and move should be auto-flattened or somethign
        database.ref(`games/${gameId}/moves`).push({
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
})

export const firebase = {
  moves: database.ref(`games/${gameId}/moves`)
}
