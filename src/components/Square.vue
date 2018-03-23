<template>
  <span
    class="square"
    :data-coord="`${square.file}${square.rank}`"
    v-on:mousedown="handlePointerDown"
    v-on:touchstart="handlePointerDown"
    v-on:mouseup="handlePointerUp"
    v-on:touchend="handlePointerUp"
    :style="{
      backgroundColor
    }"
  >
    <piece
      v-bind:piece="square.piece"
      :transform="transform"
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
      x: 0,
      y: 0,
      startX: 0,
      startY: 0
    }
  },
  computed: {
    ...mapGetters({
      previousMove: 'previousMove',
      selected: 'selected'
    }),
    transform () {
      if (this.isSelected) {
        return this.transformSelected
      } else {
        return {
          x: 0,
          y: 0
        }
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
  methods: {
    ...mapActions([
      'clickSquare',
      'selectSquare'
    ]),
    handlePointerDown (evt) {
      const square = evt.currentTarget.getAttribute('data-coord')
      const position = evt.currentTarget.getBoundingClientRect()
      this.selectSquare(square)
    },
    handlePointerUp (evt) {
      const square = evt.currentTarget.getAttribute('data-coord')
      this.clickSquare(square)
    },
    matches (square = {}) {
      const { file, rank } = square
      return this.square.file === file && this.square.rank === rank
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
  position: relative;
  width: 100 / 8%;
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
