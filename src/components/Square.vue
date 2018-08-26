<template>
  <span
    class="square"
    :data-coord="`${square.file}${square.rank}`"
    :style="{
      backgroundColor
    }"
  >
    <piece
      v-bind:piece="square.piece"
      :transform="transform"
      :selected="isSelected"
    />
  </span>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Piece from './Piece.vue'

const bg = {
  selected: '#55bbee',
  previousSrc: '#ffedab',
  previousDest: '#ffed4b'
}

export default {
  components: {
    Piece
  },
  props: {
    square: {
      type: Object
    },
    transformSelected: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      squareWidth: this.getSquareWidth()
    }
  },
  computed: {
    ...mapGetters({
      previousMove: 'previousMove',
      selected: 'selected'
    }),
    transform ({ square, squareWidth }) {
      if (this.isSelected) {
        return this.transformSelected
      }

      const { rank, file } = square
      const yIndex = rank - 1
      const xIndex = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(file)

      const x = xIndex * squareWidth
      const y = yIndex * squareWidth

      return {
        x,
        y
      }
    },
    isSelected () {
      return this.selected === `${this.square.file}${this.square.rank}`
    },
    previousSrc () {
      return this.matches(this.previousMove.src)
    },
    previousDest () {
      return this.matches(this.previousMove.dest)
    },
    backgroundColor () {
      if (this.isSelected) {
        return bg.selected
      }
      if (this.previousSrc) {
        return bg.previousSrc
      }
      if (this.previousDest) {
        return bg.previousDest
      }
    }
  },
  created () {
    window.addEventListener('resize', (evt) => {
      // wait for resize events to stop before updating size
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.updateSquareSize()
      }, 200)
    })
  },
  methods: {
    ...mapActions([
      'clickSquare',
      'selectSquare'
    ]),
    matches (square = {}) {
      const { file, rank } = square
      return this.square.file === file && this.square.rank === rank
    },
    getSquareWidth () {
      return Math.min(window.innerWidth, 600) / 8
    },
    updateSquareSize () {
      this.squareWidth = this.getSquareWidth()
    }
  }
}
</script>

<style>
.square {
  cursor: pointer;
  text-align: center;
  flex: 1 1 auto;
  display: inline-block;
  vertical-align: top;
  background: white;
  width: 12.5%;
}

.square:hover {
  background: #88ccff !important;
}

.square:after {
  content: ' ';
  padding-bottom: 100%;
  display: block;
  height: 0;
}

.square:nth-child(-2n + 8),
.square:nth-child(8) ~ .square:nth-child(-2n+15),
.square:nth-child(16) ~ .square:nth-child(-2n+24),
.square:nth-child(24) ~ .square:nth-child(-2n+31),
.square:nth-child(32) ~ .square:nth-child(-2n+40),
.square:nth-child(40) ~ .square:nth-child(-2n+47),
.square:nth-child(48) ~ .square:nth-child(-2n+56),
.square:nth-child(56) ~ .square:nth-child(-2n+63) {
  background: #aaa;
}

</style>
