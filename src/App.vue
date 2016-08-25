  <template>
    <div id="app">
      <div>
        <h3>
          <span v-if="false">Check!</span>
          <span v-if="yourMove">Your move! ({{turn}})</span>
        </h3>
        <board />
      </div>
      <button v-if="!players.white" v-on:click="setPlayer('white')">Play as White</button>
      <button v-if="!players.black" v-on:click="setPlayer('black')">Play as Black</button>
      <player />
    </div>
  </template>

<script>
  import Board from './components/Board.vue'
  import Player from './components/Player.vue'
  import {mapActions, mapGetters, mapState} from 'vuex'
  import Chess from 'node-chess'

  export default {
    components: {
      Board,
      Player,
    },
    computed: {
      ...mapGetters({
        boardState: 'boardState',
        player: 'player',
        game: 'game',
      }),
      players () {
        return this.game.players
      },
      turn () {
        return this.boardState.whitesTurn ? 'White' : 'Black'
      },
      yourMove () {
        if (this.boardState.whitesTurn) {
          return this.players.white === this.player.id
        } else {
          return this.players.black === this.player.id
        }
      },
    },
    methods: mapActions(['setPlayer']),
  }
  </script>

  <style>
  body {
    font-family: Helvetica, sans-serif;
    margin: 0;
    overflow-y: hidden;
    background: #f2f2f2;
  }

  #app {
    max-height: 100vh;
    overflow-y: scroll;
  }

  .row {
    display: flex;
  }

  input {

  }

  button {
    border: solid 1px #222;
    border-bottom: solid 2px #888;
    background: white;
    line-height: 2;
    margin: 1em;
  }
</style>
