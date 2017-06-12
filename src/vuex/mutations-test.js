/* eslint-env mocha */
import { expect } from 'chai'
import { mutations } from './store'

const { JOIN_TEAM, SET_SELECTED_SQUARE, ADD_MOVE, SET_PLAYER_NAME } = mutations

describe('mutations', function () {
  describe.skip('JOIN_TEAM', () => {
    beforeEach(() => {
      this.state = {
        playerId: '12345678',
        teams: {
          black: null,
          white: null
        }
      }
    })

    it('can join an empty team', () => {
      JOIN_TEAM(this.state, 'white')
      expect(this.state.teams).to.deep.equal({
        white: this.state.playerId,
        black: null
      })
    })

    it('cannot join an full team', () => {
      this.state.teams.white = 'somebodyelse'
      JOIN_TEAM(this.state, 'white')
      expect(this.state.teams).to.deep.equal({
        white: 'somebodyelse',
        black: null
      })
    })

    it('cannot join a fake team', () => {
      this.state.teams.white = 'somebodyelse'
      JOIN_TEAM(this.state, 'red')
      expect(this.state.teams).to.deep.equal({
        white: 'somebodyelse',
        black: null
      })
    })
  })

  describe('SET_SELECTED_SQUARE', () => {
    it('sets selected', () => {
      const state = {}
      SET_SELECTED_SQUARE(state, 'b6')
      expect(state.selected).to.equal('b6')
    })
  })

  describe('ADD_MOVE', () => {
    it('adds move', () => {
      const state = {moves: ['a4']}
      ADD_MOVE(state, 'a6')
      expect(state.moves).to.deep.equal(['a4', 'a6'])
    })

    it('ignores null values', () => {
      const state = {moves: ['a4', 'a6']}
      ADD_MOVE(state, null)
      expect(state.moves).to.deep.equal(['a4', 'a6'])
    })
  })

  describe('SET_PLAYER_NAME', () => {
    const playerId = '1234'
    const name = 'A Player'
    const state = { players: {} }
    SET_PLAYER_NAME(state, {name, playerId})
    expect(state.players[playerId]).to.equal(name)
  })
})
