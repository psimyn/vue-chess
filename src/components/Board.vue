<template>
  <div>
    <div
      class="board"
      v-on:mousedown="handlePointerDown"
      v-on:touchstart="handlePointerDown"
      v-on:mousemove="handlePointerMove"
      v-on:touchmove="handlePointerMove"
      v-on:mouseup="handlePointerUp"
      v-on:touchend="handlePointerUp"
      :class="{
        playingAsBlack
      }"
    >
      <square
        :key="`${s.file}${s.rank}`"
        v-for="s of board.squares"
        :square="s"
        :transform-selected="transform"
      />
      <div class="overlay" v-if="!gameStarted">
        <button
          class="button white"
          v-bind:class="{
            hidden: game && game.white
          }"
          v-on:click="joinTeam('white')"
        >
          <span>Play as</span>&nbsp;<span>White</span>
        </button>
        <button
          class="button black"
          v-bind:class="{
            hidden: game.black
          }"
          v-on:click="joinTeam('black')"
        >
          <span>Play as</span>&nbsp;<span>Black</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Piece from './Piece.vue'
import Square from './Square.vue'
import {mapActions, mapGetters} from 'vuex'

let updating

function coords(evt) {
  let clientX = evt.clientX
  let clientY = evt.clientY

  const touchPoint = (evt.touches && evt.touches[0]) ||
    (evt.changedTouches && evt.changedTouches[0])
  if (touchPoint) {
    clientX = touchPoint.clientX
    clientY = touchPoint.clientY
  }

  return {
    clientX,
    clientY
  }
}

export default {
  components: {
    Square
  },
  data () {
    return {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0
    }
  },
  computed: {
    ...mapGetters({
      selected: 'selected',
      board: 'board',
      game: 'game',
      players: 'players',
      previousMove: 'previousMove'
    }),
    // todo: determine, default to false
    playingAsBlack () {
      return false
    },
    gameStarted () {
      return this.game.white && this.game.black
    },
    transform () {
      return {
        x: this.x,
        y: this.y
      }
    }
  },
  methods: {
    ...mapActions([
      'joinTeam',
      'clickSquare',
      'selectSquare'
    ]),
    handlePointerDown (evt) {
      const { clientX, clientY } = coords(evt)

      this.startX = clientX
      this.startY = clientY

      this.x = 0
      this.y = 0

      const square = evt.target.getAttribute('data-coord')
      this.selectSquare(square)
    },
    handlePointerMove (evt) {
      if (updating) return

      const { clientX, clientY } = coords(evt)

      updating = true
      requestAnimationFrame(() => {
        this.x = clientX - this.startX
        this.y = clientY - this.startY
        updating = false
      })
    },
    handlePointerUp (evt) {
      this.x = 0
      this.y = 0

      const { clientX, clientY } = coords(evt)

      const el = document.elementFromPoint(clientX, clientY)
      const square = el.getAttribute('data-coord')

      this.clickSquare(square)
    }
  }
}
</script>

<style scoped>
  .board {
    padding: 1em;
    background: rgba(88, 88, 88, 0.05);

    display: flex;
    flex-direction: column-reverse;
    margin: 0 auto;
    max-width: 600px;
    box-shadow: 0 1px 2px rgba(22, 22, 22, 0.2);
    position: relative;
    transition: transform 0.4s cubic-bezier(0, 0.99, 0.3, 1);

    display: grid;
    grid-template-rows: repeat(8, 1fr);
    grid-template-columns: repeat(8, 1fr);
    align-items: stretch;
  }

  .playingAsBlack {
    flex-direction: column;
  }

  .row {
    display: flex;
  }

  .hidden {
    visibility: hidden;
  }

  .overlay {
    top: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    background: rgba(33, 33, 33, 0.66);
    z-index: 2;
    padding: 24px;
  }

  .button {
    border: none;
    font-size: calc(1em + 1vw);
    font-weight: bold;
    padding: 0 1em;
    background: rgba(20, 20, 20, 0.77);
    color: white;
    box-shadow: 0 0 2px 2px rgba(24, 24, 24, 0.4);
    text-shadow: 0 0 1px #333;
    margin: 0;
  }

  .white {
    background: rgba(240, 240, 240, 0.9);
    color: #333;
    box-shadow: 0 0 2px 2px rgba(24, 24, 24, 0.4);
  }

  .checkmate {
    flex-grow: 1;
    font-size: 3em;
    color: white;
    text-align: center;
  }

</style>

