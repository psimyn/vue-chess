/* eslint-env mocha */
import chess from 'chess'
import { expect } from 'chai'
import { initialState, SET_SELECTED_SQUARE, SET_LOADING, SET_MESSAGE, ADD_MOVE } from './store'
const actionsInjector = require('inject-loader!./store')
const fbdbMock = {
  ref () {
    return {
      off () {},
      on () {}
    }
  }
}
const actions = actionsInjector({
  'firebase': {
    initializeApp (config) {
      console.log(config)
    },
    database: {
      ref: () => {}
    }
  }
}).actions

const {
  selectSquare,
  movePiece,

  loadGame,

  setPlayer
} = actions

// taken from https://github.com/vuejs/vuex/blob/master/docs/en/testing.md
const testAction = (action, arg, state, expectedMutations, expectedError) => {
  return new Promise((resolve, reject) => {
    let count = 0

    const commit = (name, payload) => {
      const mutation = expectedMutations[count]
      // todo: this breaks if expectedMutations is an empty array
      expect(mutation.name).to.equal(name)
      if (payload) {
        expect(mutation.payload).to.deep.equal(payload)
      }
      count++
      if (count >= expectedMutations.length) {
        resolve()
      }
    }

    // perform the action
    try {
      action({commit, state}, arg)
    } catch (error) {
      if (!expectedError) throw error
      expect(error.message).to.equal(expectedError)
    }

    // no mutations should have been dispatched
    if (expectedMutations.length === 0) {
      expect(count).to.equal(0)
      resolve()
    }
  })
}

function * testVuexAction ({state, action}, args) {
  yield '1234'
}

const createUser = ({
  uid = '12345678',
  name = 'Test Subject'
}) => ({
  uid,
  name
})

describe.only('player actions', function () {
  describe('guest', (done) => {
    const initialState = {
      id: null,
      name: null
    }

    const mutations = testVuexAction({
      state: initialState,
      action: setPlayer
    }, createUser())

    const mutation = mutations.next()
    expect(mutation).to.equal('1234')

    expect(mutations.length).to.equal(1)
  })
})

describe('actions', function () {
  describe('joinTeam', () => {
    // todo: move mutations to here
  })

  describe.skip('loadGame', () => {
    it('remove refs', () => {
      const state = {
        gameId: 'oldtestgame',
        game: {black: 123, white: 456}
      }
      return testAction(loadGame, 'testgame', state, [
        {name: SET_LOADING, payload: true},
        {name: SET_LOADING, payload: false}
      ])
    })
  })

  describe('select piece', () => {
    beforeEach(() => {
      const playerId = 'me'
      this.state = {
        ...initialState,
        playerId,
        teams: {
          white: playerId,
          black: 'otherguy'
        }
      }
    })

    it('can select own piece', () => {
      testAction(selectSquare, 'a1', this.state, [
        {name: SET_SELECTED_SQUARE}
      ])
    })

    it('can not select empty square', () => {
      testAction(selectSquare, 'd4', this.state, [])
    })

    it(`error if selecting other player's pieces`, () => {
      const expectedMutations = [
        {
          name: SET_MESSAGE,
          payload: 'Not your piece'
        }
      ]
      testAction(selectSquare, 'h8', this.state, expectedMutations)
    })

    it(`can not select out of turn`, () => {
      const state = {
        ...this.state
      }
      const expectedMutations = [
        {
          name: SET_MESSAGE,
          payload: `It is black's move`
        }
      ]
      testAction(selectSquare, 'a1', state, expectedMutations)
    })
  })

  describe('movePiece', () => {
    beforeEach(() => {
      this.state = {
        ...initialState,
        gameClient: chess.create({PGN: true})
      }
    })

    // todo: store moves in PGN
    it.skip('adds move to list', () => {
      const state = {
        ...initialState,
        selected: 'c2'
      }
      const expectedMutations = [{
        name: ADD_MOVE,
        payload: 'c3'
      }]
      return testAction(movePiece, 'c3', state, expectedMutations)
    })

    it(`does not move if no piece is selected`, () => {
      const expectedMutations = []
      const state = {
        ...initialState,
        selected: null
      }
      return testAction(movePiece, 'd4', state, expectedMutations, 'no piece selected')
    })

    it.skip('clears selected after moving', () => {

    })
  })
})
