<template>
  <span
    class="square"
    v-on:click="selectSquare(square)"
    v-bind:class="{black, selected}"
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
  props: ['square', 'selected'],
  computed: {
    black() {
      return !((this.square.rank % 2 == 0 && this.square.file % 2 == 1)
      || (this.square.rank % 2 == 1 && this.square.file % 2 == 0))
    },
  },
  methods: {
    selectSquare (square) {
      this.$store.dispatch('selectSquare', square)
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
