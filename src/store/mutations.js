import Vue from 'vue'

export const SET_PLAYER_NAME = 'SET_PLAYER_NAME'
export const SET_PLAYER = 'SET_PLAYER'
export const UNSET_PLAYER = 'UNSET_PLAYER'
export const UPDATE_PLAYER_NAMES = 'UPDATE_PLAYER_NAMES'
export const SET_MESSAGE = 'SET_MESSAGE'
export const SET_SELECTED_SQUARE = 'SET_SELECTED_SQUARE'
export const ADD_MOVE = 'ADD_MOVE'
export const SET_CURRENT_MOVE = 'SET_CURRENT_MOVE'
export const SET_GAME_ID = 'SET_GAME_ID'
export const UPDATE_MY_GAMES = 'UPDATE_MY_GAMES'
export const SET_LOADING = 'SET_LOADING'
export const SHOW_PLAYER_NAME_CONFIRMATION = 'SHOW_PLAYER_NAME_CONFIRMATION'

export default {
  [SET_LOADING](state, val) {
    state.loading = val
  },
  [SET_MESSAGE](state, message) {
    state.message = message
  },
  [SET_SELECTED_SQUARE](state, selection) {
    state.selected = selection
  },
  [ADD_MOVE](state, move) {
    // todo: should this error instead?
    if (move) {
      state.moves = state.moves.concat(move)
      state.currentMove = state.moves.length
    }
  },
  [SET_CURRENT_MOVE](state, val) {
    debugger
    state.currentMove = val
  },

  [SET_GAME_ID](state, gameId) {
    state.gameId = gameId
  },
  [UPDATE_MY_GAMES](state, { gameId, white, black }) {
    const game = state.player.games[gameId] || {}
    game['white'] = white || game.white
    game['black'] = black || game.black
    state.player.games = {
      ...state.player.games,
      [gameId]: game
    }
  },
  [UPDATE_PLAYER_NAMES](state, players) {
    state.players = {
      ...state.players,
      ...players
    }
  },

  [SET_PLAYER](
    state,
    {
      id,
      name,
      isAnonymous,
      games = []
    } = {}) {
    state.playerId = id
    Vue.set(state, 'player', {
      ...state.player,
      id,
      name,
      isAnonymous,
      games
    })
  },
  [SET_PLAYER_NAME](state, { name, playerId }) {
    state.player.name = name
    state.players = {
      ...state.players,
      [playerId]: name
    }
  }
}
