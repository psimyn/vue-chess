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
    gameStatus: (state) => {
      return state.gameClient.getStatus()
    },
    previousMove: (state) => {
      const moves = state.gameClient.game.moveHistory
      const last = moves.length - 1
      const lastMove = moves[last]
      if (!lastMove) return {}
      return {
        capturedPiece: lastMove.capturedPiece,
        dest: {
          rank: lastMove.postRank,
          file: lastMove.postFile
        }
      }
    },
    selected: state => state.selected,
    capturedPieces: (state) => {
      const moves = state.gameClient.game.moveHistory
      return moves.reduce((acc, move) => {
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
