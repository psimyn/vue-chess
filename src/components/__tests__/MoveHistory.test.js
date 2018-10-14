import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import registerElements from '../../elements'
import MoveHistory from '../MoveHistory.vue'

const localVue = createLocalVue()

localVue.use(Vuex)
registerElements(localVue)

const firstMoveButton = '[data-test=firstMove]'
const prevMoveButton = '[data-test=prevMove]'
const nextMoveButton = '[data-test=nextMove]'
const lastMoveButton = '[data-test=lastMove]'

describe('MoveHistory.vue', () => {
  let actions
  let store

  beforeEach(() => {
    actions = {
      setCurrentMove: jest.fn()
    }
    store = new Vuex.Store({
      state: {
        currentMove: 4
      },
      getters: {
        currentMove: () => store.state.currentMove,
        moves: () => ['d4', 'd5', 'c4', 'c5']
      },
      actions
    })
  })

  describe('First move', () => {
    it('dispatches setCurrentMove', () => {
      const wrapper = shallowMount(MoveHistory, { store, localVue })
      const button = wrapper.find(firstMoveButton)
      button.trigger('click')
      expect(actions.setCurrentMove).toHaveBeenCalled()
    })

    it('is disabled when currentMove is 1', () => {
      store.state.currentMove = 0
      const wrapper = shallowMount(MoveHistory, { store, localVue })
      const button = wrapper.find(firstMoveButton)
      expect(button.attributes('disabled')).toBeTruthy()
    })
  })

  describe('Previous move', () => {
    it('dispatches setCurrentMove', () => {
      const wrapper = shallowMount(MoveHistory, { store, localVue })
      const button = wrapper.find(prevMoveButton)
      button.trigger('click')
      expect(actions.setCurrentMove).toHaveBeenCalled()
    })

    it('is disabled when currentMove is 1', () => {
      store.state.currentMove = 0
      const wrapper = shallowMount(MoveHistory, { store, localVue })
      const button = wrapper.find(prevMoveButton)
      expect(button.attributes('disabled')).toBeTruthy()
    })
  })

  describe('Next move', () => {
    it('dispatches setCurrentMove', () => {
      const wrapper = shallowMount(MoveHistory, { store, localVue })
      const button = wrapper.find(nextMoveButton)
      button.trigger('click')
      expect(actions.setCurrentMove).toHaveBeenCalled()
    })

    it('is disabled when currentMove is last', () => {
      store.state.currentMove = store.getters.moves.length - 1
      const wrapper = shallowMount(MoveHistory, { store, localVue })
      const button = wrapper.find(nextMoveButton)
      expect(button.attributes('disabled')).toBeTruthy()
    })
  })

  describe('Last move', () => {
    it('dispatches setCurrentMove', () => {
      const wrapper = shallowMount(MoveHistory, { store, localVue })
      const button = wrapper.find(lastMoveButton)
      button.trigger('click')
      expect(actions.setCurrentMove).toHaveBeenCalled()
    })

    it('is disabled when currentMove is last', () => {
      store.state.currentMove = store.getters.moves.length - 1
      const wrapper = shallowMount(MoveHistory, { store, localVue })
      const button = wrapper.find(lastMoveButton)
      expect(button.attributes('disabled')).toBeTruthy()
    })
  })
})