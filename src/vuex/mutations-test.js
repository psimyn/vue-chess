import { expect } from 'chai'
import chess from 'chess'
import { mutations, initialState } from './store'

const { JOIN_TEAM, SET_SELECTED_SQUARE, ADD_MOVE } = mutations

describe('mutations', () => {
  describe.skip('JOIN_TEAM', () => {
    beforeEach(() => {
      this.state = {
        playerId: '131323sda5',
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
      SET_SELECTED_SQUARE(state, 'g6')
      expect(state.selected).to.equal('g6')
    })

    it('sets to null', () => {
      const state = {selected: 'g6'}
      SET_SELECTED_SQUARE(state, null)
      expect(state.selected).to.be.a('null')
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
})
