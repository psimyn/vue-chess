import Vue from 'vue'
import Vuex from 'vuex'
import chess from 'chess'
import { actions, playerActions } from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const initialState = {
  // game meta
  gameId: null,
  game: { white: null, black: null },
  players: {},

  // game state
  moves: [],
  movesById: {},
  currentMove: -1,
  capturedPieces: {
    white: [],
    black: []
  },

  gameClient: chess.create({ PGN: true }),

  // player
  playerId: null,
  player: {
    id: null,
    name: 'Guest',
    games: {}
  },

  // ui
  loading: true,
  loadingGames: true,
  selected: null,
  message: null,
  version: VERSION
}

export default {
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
    game: (state, getters) => {
      const { isCheck, isCheckmate, isStalemate } = getters.gameStatus
      return {
        ...state.game,
        isCheck,
        isCheckmate,
        isStalemate
      }
    },
    gameStarted: (state) => {
      return state.game.white && state.game.black
    },
    currentMove: state => state.currentMove,
    players: state => state.players,
    message: state => state.message,
    moves: state => state.moves,
    currentMoves: (state, getters) => {
      return []
      const gameClient = chess.create({ PGN: true })
      return getters.currentMovesPgn.map(m => {
        try {
          return gameClient.move(m)
        } catch (e) {
          debugger
          console.error(e)
        }
      })
    },
    currentMovesPgn: state => state.moves, // .slice(0, state.currentMove + 1),
    gameStatus: (state) => {
      return state.gameClient.getStatus()
    },
    previousMove: (state, getters) => {
      return {}
      if (getters.currentMoves.length === 0) return {};
      const move = getters.currentMoves[getters.currentMoves.length - 1]
      if (!move) {
        console.error('invalid moves for game: ', state.gameId)
      }
      return {
        src: move.prevSquare,
        dest: move.postSquare,
        capturedPiece: move.capturedPiece
      }
    },
    selected: state => state.selected,
    capturedPieces: (state, getters) => {
      return {
        white: [],
        black: []
      }
      const moves = getters.currentMoves
      return moves.reduce((acc, { move }) => {
        const capturedPiece = move.capturedPiece
        if (capturedPiece) {
          acc[capturedPiece.side.name].push(capturedPiece)
        }
        return acc
      }, {
          white: [],
          black: []
        })
    }
  }
}
