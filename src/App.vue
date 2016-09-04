  <template>
    <div id="app">
      <div class="container">
        <board />
        <status />
      </div>
      <sidebar />
    </div>
  </template>

<script>
  import Board from './components/Board.vue'
  import Status from './components/Status.vue'
  import Sidebar from './components/Sidebar.vue'
  import {mapActions, mapGetters, mapState} from 'vuex'

  export default {
    components: {
      Board,
      Sidebar,
      Status,
    },
    computed: {
      ...mapGetters({
        player: 'player',
        game: 'game',
        moves: 'moves',
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
    methods: mapActions(['setPlayer']),
  }
  </script>

  <style>
  body {
    font-family: Helvetica, sans-serif;
    margin: 0;
    overflow-y: hidden;
    height: 100vh;
    background: #f2f2f2;
  }

  #app {
    max-height: 100vh;
    overflow-y: scroll;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
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
    margin: 1em 0;
  }
</style>
