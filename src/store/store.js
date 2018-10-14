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
  gameClient: chess.create({ PGN: true }),
  moves: [],
  currentMove: 1,

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
    game: state => {
      const { isCheck, isCheckmate, isStalemate } = state.gameClient.getStatus()
      return {
        ...state.game,
        isCheck,
        isCheckmate,
        isStalemate
      }
    },
    currentMove: state => state.currentMove,
    players: state => state.players,
    message: state => state.message,
    moves: state => state.moves,
    previousMove: state => {
      const gameClient = chess.create({ PGN: true })
      const prevMove = state.moves.reduce((acc, moveTo, index, arr) => {
        // todo: enable undo
        const { move } = gameClient.move(moveTo)

        if (index === arr.length - 1) {
          return {
            src: move.prevSquare,
            dest: move.postSquare,
            capturedPiece: move.capturedPiece
          }
        }
        return acc
      }, {})
      return prevMove
    },
    selected: state => state.selected,
    capturedPieces: state => {
      const gameClient = chess.create({ PGN: true })
      const capturedPieces = state.moves.reduce((acc, moveTo) => {
        const { move } = gameClient.move(moveTo)
        const { capturedPiece } = move
        if (capturedPiece) {
          acc[capturedPiece.side.name].push(capturedPiece)
        }
        return acc
      }, {
          white: [],
          black: []
        })
      return capturedPieces
    },
    board: state => {
      state.gameClient = chess.create({ PGN: true })
      state.moves.forEach((moveTo, index) => {
        if (index > state.currentMove) return
        state.gameClient.move(moveTo)
      })
      return state.gameClient.getStatus().board
    }
  }
}
