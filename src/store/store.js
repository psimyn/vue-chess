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
  currentMove: 0,

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
    game: (state, getters) => {
      const { isCheck, isCheckmate, isStalemate } = getters.gameStatus
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
    gameStatus: state => {
      const gameClient = chess.create({ PGN: true })
      state.moves.forEach(m => gameClient.move(m))
      return gameClient.getStatus()
    },
    previousMove: state => {
      const gameClient = chess.create({ PGN: true })
      const movesToCurrent = state.moves.slice(0, state.currentMove + 1)
      const prevMove = movesToCurrent.reduce((acc, moveTo, index, arr) => {
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
    capturedPieces: (state, getters) => {
      const moves = Object.entries(getters.gameStatus.notatedMoves)
      return moves.reduce((acc, status) => {
        const capturedPiece = status.dest
        if (capturedPiece) {
          acc[capturedPiece.side.name].push(capturedPiece)
        }
        return acc
      }, {
          white: [],
          black: []
        })
    },
    // board: state => {
    //   const gameClient = chess.create({ PGN: true })
    //   state.moves.forEach((moveTo, index) => {
    //     if (index > state.currentMove) return
    //     gameClient.move(moveTo)
    //   })
    //   return gameClient.getStatus().board
    // }
  }
}
