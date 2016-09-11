<template>
  <div class="board" v-bind:class="{flat, playingAsBlack}">
    <div class="row" v-for="row in ranks">
      <square
        v-for="s of row"
        v-bind:square="s"
        v-bind:selected="s == selected">
      </square>
    </div>
    <div class="overlay" v-if="!gameStarted">
      <button
        class="button white"
        v-bind:class="{
          hidden: players.white
        }"
        v-on:click="setPlayer('white')"
      >
        <span>Play as</span>&nbsp;<span>White</span>
      </button>
      <button
        class="button black"
        v-bind:class="{
          hidden: players.black
        }"
        v-on:click="setPlayer('black')"
      >
        <span>Play as</span>&nbsp;<span>Black</span>
      </button>
    </div>
    <div class="overlay" v-if="game.isCheckmate">
      <h3 class="checkmate" v-if="game.isCheckmate">Checkmate</h3>
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
      game: 'game',
    }),
    // todo: make switchable
    flat () {
      return true
    },
    // todo: determine, default to false
    playingAsBlack () {
      return true
    },
    players () {
      return this.game.players
    },
    gameStarted () {
      return this.players.white && this.players.black
    },
    ranks () {
      return this.board.squares.reduce((acc, item) => {
        acc[item.rank] = acc[item.rank] || []
        acc[item.rank].push(item)
        return acc
      }, [])
    }
  },
  methods: mapActions(['setPlayer']),
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
  }

  .board:not(.flat) {
    perspective: 600px;
    transform: rotate3d(1, 0, 0, 30deg);
    transform-style: preserve-3d;
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
    justify-content: space-around;
    background: rgba(33, 33, 33, 0.66);
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
