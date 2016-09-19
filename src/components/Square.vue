<template>
  <span
    class="square"
    v-on:click="handleClick(square)"
    v-bind:class="{
      black,
      selected: selected === `${square.file}${square.rank}`
    }"
  >
    <piece v-bind:piece="square.piece" />
  </span>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Piece from './Piece.vue'

export default {
  components: {
    Piece
  },
  props: ['square'],
  computed: {
    ...mapGetters({selected: 'selected'}),
    black() {
      return !((this.square.rank % 2 == 1 && ['a', 'c', 'e', 'g'].includes(this.square.file))
      || (this.square.rank % 2 == 0 && ['b', 'd', 'f', 'h'].includes(this.square.file)))
    },
  },
  methods: {
    ...mapActions(['selectSquare', 'movePiece']),
    handleClick (square) {
      square = `${square.file}${square.rank}`
      if (this.selected) {
        this.movePiece(square)
      } else {
        this.selectSquare(square)
      }
    }
  }
}
</script>

<style>
.square {
  cursor: pointer;
  text-align: center;
  flex: 1 1 auto;
  padding: 0;
  display: inline-block;
  vertical-align: top;
  background: white;
  position: relative;
}

.square:hover {
  box-shadow: 0 0 3px 2px #2288bb inset;
}

.square:after {
  content: ' ';
  padding-bottom: 100%;
  display: block;
  height: 0;
}

.black {
  background: #bbb;
}

.selected {
  box-shadow: 0 0 4px 2px #2288bb inset;
}
</style>
