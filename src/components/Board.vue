<template>
  <div class="board">
    <div class="row" v-for="row in ranks">
      <square
        v-bind:square="square"
        v-bind:selected="square == selected"
        v-for="square in row.squares.filter(i => i != null)"
      >
      </square>
    </div>
  </div>
</template>

<script>
import Square from './Square.vue'
import {mapActions, mapGetters, mapState} from 'vuex'
import Chess from 'node-chess'

export default {
  components: {
    Square,
  },
  computed: {
    ...mapGetters({
      selected: 'selected',
      boardState: 'boardState',
    }),
    ranks () {
      return this.boardState.ranks.filter(rank => rank != null)
    }
  },
}
</script>

<style>
  .board {
    margin: 0 auto;
    max-width: 600px;
    box-shadow: 0 1px 2px rgba(22, 22, 22, 0.2);
  }
  .row {
    display: flex;
  }
</style>
