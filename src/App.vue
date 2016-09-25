  <template>
    <div id="app">
      <loader v-if="loading" />
      <div v-if="!loading" class="container">
        <board v-if="player.id && player.name" />
        <status v-if="player.id && player.name" />
        <move-history></move-history>
        <player />
      </div>
    </div>
  </template>

<script>
  import Board from './components/Board.vue'
  import Status from './components/Status.vue'
  import Player from './components/Player.vue'
  import MoveHistory from './components/MoveHistory.vue'
  import Loader from './components/Loader.vue'
  import {mapActions, mapGetters, mapState} from 'vuex'

  export default {
    components: {
      Board,
      Loader,
      MoveHistory,
      Player,
      Status,
    },
    computed: {
      ...mapGetters({
        player: 'player',
        game: 'game',
        gameId: 'gameId',
        moves: 'moves',
        loading: 'loading',
      }),
      players () {
        return this.game.players
      },
      turn () {
        return this.moves.length % 2 === 1 ? 'White' : 'Black'
      },
      yourMove () {
        if (this.moves.length % 2 === 1) {
          return this.players.white === this.player.id
        } else {
          return this.players.black === this.player.id
        }
      },
    },
    created () {

    },
  }
  </script>

  <style>
  body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    overflow-y: hidden;
    height: 100vh;
    background: #f2f2f2;
  }

  h3 {
    margin: 0;
  }

  body * {
    font-family: 'Roboto', sans-serif;
    font-size: 1em;
  }

  #app {
    max-height: 100vh;
    overflow-y: scroll;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    perspective: 700px;
  }

  .row {
    display: flex;
  }

  button {
    border: solid 1px #222;
    border-bottom: solid 2px #888;
    background: white;
    line-height: 2;
    margin: 1em 0;
  }
</style>
