<template>
  <div>
    <div class="board" v-bind:class="{playingAsBlack}">
      <square
        :key="`${s.file}${s.rank}`"
        v-for="s of board.squares"
        :square="s"
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
import Square from './Square.vue'
import {mapActions, mapGetters} from 'vuex'

export default {
  components: {
    Square
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
    }
  },
  methods: mapActions(['joinTeam'])
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
