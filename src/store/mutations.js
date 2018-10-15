import Vue from 'vue'
import {
  SET_PLAYER_NAME,
  SET_PLAYER,
  UNSET_PLAYER,
  UPDATE_PLAYER_NAMES,
  SET_MESSAGE,
  SET_SELECTED_SQUARE,
  ADD_MOVE,
  SET_CURRENT_MOVE,
  SET_GAME_ID,
  UPDATE_MY_GAMES,
  SET_LOADING,
  SET_LOADING_GAMES,
  SHOW_PLAYER_NAME_CONFIRMATION
} from './mutation-types';

export default {
  [SET_LOADING](state, val) {
    state.loading = val
  },
  [SET_LOADING_GAMES](state, val) {
    state.loadingGames = val
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
