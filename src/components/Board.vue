<template>
  <div class="board">
    <div class="row" v-for="row in ranks">
      <square
        v-for="s of row"
        v-bind:square="s"
        v-bind:selected="s == selected">
      </square>
    </div>
  </div>
</template>

<script>
import Square from './Square.vue'
import {mapActions, mapGetters, mapState} from 'vuex'

export default {
  components: {
    Square,
  },
  computed: {
    ...mapGetters({
      selected: 'selected',
      board: 'board',
    }),
    ranks () {
      return this.board.squares.reduce((acc, item) => {
        acc[item.rank] = acc[item.rank] || []
        acc[item.rank].push(item)
        return acc
      }, [])
    }
  },
}
</script>

<style>
  .board {
    padding: 1em;
    background: rgba(88, 88, 88, 0.05);
    display: flex;
    flex-direction: column-reverse;
    margin: 0 auto;
    max-width: 600px;
    box-shadow: 0 1px 2px rgba(22, 22, 22, 0.2);
  }

  .row {
    display: flex;
  }
</style>
