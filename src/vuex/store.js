import Vue from 'vue'
import Vuex from 'vuex'
import VuexFire from 'vuexfire'
import Firebase from 'firebase'
import chess from 'node-chess'

Vue.use(Vuex)
Vue.use(VuexFire)

// initial state
const state = {
  game: chess.classic.engine(),
  gameId: null,
  ranks: [],
  moves: [],
  turn: 'White',
  selected: null,
}

const config = {
  apiKey: "AIzaSyDgo_wWAkKHmFxHMvDGFL4IUKfy0WNyJK4",
  authDomain: "chess-cfde8.firebaseapp.com",
  databaseURL: "https://chess-cfde8.firebaseio.com",
  storageBucket: "",
};

Firebase.initializeApp(config);
const database = Firebase.database()

const gameId = document.location.hash.slice(1) || database.ref('games').push().key
document.location.hash = `#${gameId}`

const playerId = localStorage.getItem('playerId') || database.ref('users').push().key
localStorage.setItem('playerId', playerId)
// database.ref(`users/${playerId}/games`).push(gameId)

export const store = new Vuex.Store({
  state,
  mutations: VuexFire.mutations,
  getters: {
    things: state => 'test',
    moves: state => state.moves,
    ranks: state => state.game.boardState.ranks.filter(r => r != null),
    turn: state => state.turn ? 'White' : 'Black',
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
        state.turn = state.game.boardState.whitesTurn
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
