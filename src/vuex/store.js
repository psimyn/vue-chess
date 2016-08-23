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


const playerId = database.ref('players').push().key

// initial state
const state = {
  game: chess.classic.engine(),
  boardState: {},
  gameId: document.location.hash.slice(1) || database.ref('games').push().key,
  ranks: [],
  moves: [],
  selected: null,
  player: {
    name: 'test',
    id: playerId,
  },
}

document.location.hash = `#${state.gameId}`

const chessActions = {
  // todo: this should be 2 functions, and call the correct one
  // based on selected
  selectSquare ({commit, state}, square) {
    if (state.selected) {
      const move = {from: state.selected, to: square}
      state.game.movePiece(move)
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
    database.ref(`player/${playerId}`).child('name').set(name)
  }
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
    playerName: state => {
      return state.player.name
    },
    boardState: state => {
      state.game = chess.classic.engine()
      state.moves.forEach((move) => {
        state.game.movePiece(move)
      })
      return state.game.boardState
    },
    selected: state => state.selected,
  },
  actions: {
    ...chessActions,
    ...playerActions,
  }
})

export const firebase = {
  moves: database.ref(`games/${state.gameId}/moves`),
  player: {
    source: database.ref(`players/${state.player.id}`),
    asObject: true,
  }
}
