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

// check localStorage for playerId, else get from firebase
const search = document.location.search.slice(1)
let pid
if (search.indexOf('pid=') > -1) {
  pid = search.split('pid=')[1].split('&')[0].split('#')[0]
}
const playerId = pid || localStorage.getItem('playerId') || playerRef.push().key
const gameId = document.location.hash.slice(1) || gameRef.push().key

let engine = chess.classic.engine()
const moves = [] // JSON.parse(localStorage.getItem('moves') || '[]')

const gameState = {
  gameId,
  boardState: makeMoves(moves),
  moves,
  players: {
    white: null,
    black: null,
  },
}

function makeMoves (moves) {
  engine = chess.classic.engine()
  moves.forEach((move) => {
    engine.movePiece(move)
  })
  return engine.boardState
}

// initial state
const state = {
  playerId,

  ...gameState,

  selected: null,

  player: {
    name: 'Player 1',
  },
}

localStorage.setItem('playerId', state.playerId)
document.location.hash = `#${state.gameId}`

const chessActions = {
  setPlayer ({state}, color) {
    state.players[color] = state.playerId
    // todo
    database.ref(`games/${state.gameId}/players/${color}`).set(state.playerId)
  },
  // todo: this should be 2 functions, and call the correct one
  // based on selected
  selectSquare ({commit, state}, square) {
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
      state.boardState = makeMoves(state.moves.concat(move))
      const moves = state.boardState.moveHistory.map(m => ({from: m.from, to: m.to}))
      state.moves = moves
      state.selected = null
      // database.ref(`games/${state.gameId}/moves`).set(moves)
    } else {
      if (!square.piece) return
      if (square.piece.isWhite && state.playerId === state.players.white) {
        state.selected = square
      } else if (!square.piece.isWhite && state.playerId === state.players.black) {
        state.selected = square
      }
    }
  }
}

const playerActions = {
  setName ({state}, name) {
    // database.ref(`players/${state.playerId}/name`).set(name)
  },
}

export const store = new Vuex.Store({
  state,
  mutations: {
    ...VuexFire.mutations,
  },
  getters: {
    player: state => {
      return {
        ...state.player,
        id: state.playerId,
      }
    },
    game: state => ({
      players: state.players
    }),
    boardState: state => {
      return makeMoves(state.moves)
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
  ...chessBase,
  player: {
    source: database.ref(`players/${state.playerId}`),
    asObject: true,
  }
}
