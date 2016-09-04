  <template>
    <div id="">
      <h3>
        <span v-if="false">Check!</span>
        <span v-if="yourMove">Your move! ({{turn}})</span>
      </h3>
      <button v-if="!players.white" v-on:click="setPlayer('white')">Play as White</button>
      <button v-if="!players.black" v-on:click="setPlayer('black')">Play as Black</button>
      <div v-if="moves.length > 1">
        <button v-on:click="showMoves = !showMoves">
          Move History
        </button>
        <p v-if="showMoves" v-for="move in moves">
          {{move}}
        </p>
      </div>
    </div>
  </template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex'

  export default {
    components: {
    },
    data () {
      return {
        showMoves: false,
      }
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
      moves () {
        return this.boardState.moveHistory.map((move) => {
          const from = {
            row: move.from.rank,
            column: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'][move.from.file - 1],
          }
          const to = {
            row: move.to.rank,
            column: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'][move.to.file - 1],
          }

          return `${from.column}${from.row} => ${to.column}${to.row}`
        })
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
