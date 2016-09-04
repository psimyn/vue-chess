  <template>
    <div id="">
      <h3>
        <span v-if="false">Check!</span>
        <span v-if="yourMove">Your move! ({{turn}})</span>
        <span v-if="message">{{message}}</span>
      </h3>
      <button v-if="!players.white" v-on:click="setPlayer('white')">Play as White</button>
      <button v-if="!players.black" v-on:click="setPlayer('black')">Play as Black</button>
      <div v-if="moves.length > 1" class="moveHistory">
        <button v-on:click="showMoves = !showMoves">
          Move History
        </button>
        <p v-if="!showMoves" v-for="move in groupedMoves" class="move">
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
        player: 'player',
        game: 'game',
        moves: 'moves',
        message: 'message',
      }),
      players () {
        return this.game.players
      },
      turn () {
        return this.moves.length % 2 === 0 ? 'White' : 'Black'
      },
      groupedMoves () {
        return this.moves.reduce((moveList, move, index) => {
          const moveIndex = Math.floor(index / 2)
          const moveNumber = moveIndex + 1
          moveList[moveIndex] = moveList[moveIndex] || `${moveNumber}.`
          moveList[moveIndex] += ` ${move.pge}`
          return moveList
        }, [])
      },
      yourMove () {
        if (this.moves.length % 2 === 0) {
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
  button {
    border: none;
    border-bottom: solid 2px #888;
    background: white;
  }

  .moveHistory {
    padding: 1em;
    float: right;
    background: white;
    transition: width 0.15s;
  }

  .move {
    line-height: 1.5;
    font-size: calc(1em + 1vw);
    margin: 0 auto;
    font-weight: bold;
  }
</style>
