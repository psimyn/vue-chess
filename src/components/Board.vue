<template>
  <div>
    <div
      class="board"
      v-loading="loading"
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
      <div
        v-if="!gameStarted && !loading"
        class="overlay"
      >
        <svg-piece class="mascot white" side="white" piece="knight" />
        <svg-piece class="mascot black" side="black" piece="knight" />
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
import SvgPiece from './SvgPiece.vue'
import Piece from './Piece.vue'
import Square from './Square.vue'
import {mapActions, mapGetters} from 'vuex'

let updating

function coords (evt) {
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
    Square,
    SvgPiece
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
      previousMove: 'previousMove',
      loading: 'loading'
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
  created () {
    window.addEventListener('resize', (evt) => {
      this.setSquareSize()
    })
  },
  methods: {
    ...mapActions([
      'joinTeam',
      'clickSquare',
      'selectSquare'
    ]),
    setSquareSize () {
      const { top, left, width } = this.$el.getBoundingClientRect()
      const squareSize = width / 8
      this.startX = left + (squareSize / 2)
      this.startY = top + (squareSize / 2)
    },
    handlePointerDown (evt) {
      const square = evt.target.getAttribute('data-coord')
      this.selectSquare(square)

      this.setSquareSize()
      const { clientX, clientY } = coords(evt)
      this.x = clientX - this.startX
      this.y = clientY - this.startY
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
    background: rgba(88, 88, 88, 0.05);
    margin: 0 auto;
    max-width: 600px;
    box-shadow: 0 1px 2px rgba(22, 22, 22, 0.2);
    position: relative;
    transition: transform 0.4s cubic-bezier(0, 0.99, 0.3, 1);
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
    background: rgba(233, 233, 233, 0.9);
    z-index: 2;
    padding: 24px;
    display: flex;
    align-items: flex-start;
  }

  .button {
    color: #333;
    border: none;
    font-size: calc(1em + 1vw);
    font-weight: bold;
    padding: 0.5em 1em;
    box-shadow: 0 0 2px 2px rgba(24, 24, 24, 0.4);
    margin: auto 0 0;
  }

  .black {
    margin-left: auto;
  }

  .checkmate {
    flex-grow: 1;
    font-size: 3em;
    color: white;
    text-align: center;
  }

  .mascot {
    transform: scale(4) translate(0, 0) rotate(10deg);
    margin-left: 0;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -25%;
  }

  .mascot.white {
    transform: scale(10) rotate(25deg) rotateY(180deg) ;
    margin-left: -50%;
  }

  .mascot.black {
    left: auto;
    transform: scale(10) rotateZ(-25deg);
  }

</style>
