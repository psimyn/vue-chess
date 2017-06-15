<template>
  <span
    class="square"
    v-on:click="clickSquare(square)"
    v-bind:class="{
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
    ...mapGetters({selected: 'selected'})
  },
  methods: {
    ...mapActions(['clickSquare'])
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
  box-shadow: 0 0 3px 2px #2288bb inset;
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

.selected {
  box-shadow: 0 0 4px 2px #2288bb inset;
}
</style>
