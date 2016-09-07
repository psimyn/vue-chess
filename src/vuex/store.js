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

// check localStorage for playerId, else get from firebase
const playerId = localStorage.getItem('playerId')
const gameId = document.location.hash.slice(1) || gameRef.push().key

const cachedGame = JSON.parse(localStorage.getItem(gameId) || '{}')
const moves = cachedGame.moves || []
const players = cachedGame.players || {white: null, black: null}
const gameClient = chess.create()
moves.forEach(move => {
  gameClient.move(move)
})

const gameState = {
  gameId,
  gameClient,
  moves,
  currentMove: moves.length,
  players,
}

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

document.location.hash = `#${state.gameId}`

const chessActions = {
  setPlayer ({state}, color) {
    state.players[color] = state.playerId
    // todo
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
  setName ({state}, name) {
    // database.ref(`players/${state.playerId}/name`).set(name)
  },
  setPlayerId ({state}, player) {
    if (player) {
      state.playerId = player.uid
      localStorage.setItem('playerId', player.uid)
      state.player = {
        ...state.player,
        photoUrl: player.photoUrl,
        name: player.displayName,
      }
    } else {
      localStorage.removeItem('playerId')
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
      console.log(error)
    })
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
      players: state.players,
      isCheck: state.gameClient.getStatus().isCheck,
      isCheckmate: state.gameClient.getStatus().isCheckmate,
    }),
    message: state => state.message,
    moves: state => state.moves,
    currentMove: state => state.currentMove,
    board: state => {
      state.gameClient = chess.create({PGN: true})
      state.moves.forEach((move, index) => {
        if (index > state.currentMove) return
        try {
          move = move.pge || move
          localStorage.setItem(state.gameId, JSON.stringify({
            moves: state.moves.map(move => move.pge),
            players: state.players
          }))
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
