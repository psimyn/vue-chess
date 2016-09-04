import Vue from 'vue'
import Vuex from 'vuex'
import VuexFire from 'vuexfire'
import Firebase from 'firebase'
import chess from 'chess'

Vue.use(Vuex)
Vue.use(VuexFire)

window.Chess = chess

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

const moves = [] // JSON.parse(localStorage.getItem('moves') || '[]')
const gameState = {
  gameId,
  gameClient: chess.create(),
  moves,
  players: {
    white: null,
    black: null,
  },
}

window.State = gameState

// initial state
const state = {
  ...gameState,

  selected: null,
  message: '',

  playerId,
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
        database.ref(`games/${state.gameId}/moves`).push({
          pge: validMove,
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
    message: state => state.message,
    moves: state => state.moves,
    board: state => {
      state.gameClient = chess.create({PGN: true})
      state.moves.forEach((move, index) => {
        try {
          move = move.pge || move
          state.gameClient.move(move)
        } catch (e) {
          console.log(index, move)
          // this will happen for every n-1 moves
        }
      })
      return state.gameClient.getStatus().board
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
