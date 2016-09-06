  <template>
    <div id="">
      <div class="overlay" v-if="!gameStarted">
        <button
          class="white"
          v-bind:class="{
            hidden: players.white
          }"
          v-on:click="setPlayer('white')"
        >
          <span>Play as </span><span>White</span>
        </button>
        <button
          class="black"
          v-bind:class="{
            hidden: players.black
          }"
          v-on:click="setPlayer('black')"
        >
          <span>Play as </span><span>Black</span>
        </button>
      </div>
      <h3 v-if="!gameStarted">Waiting for players...</h3>
      <h3 v-if="gameStarted">
        <span v-if="isCheck">Check!</span>
        <span v-if="yourMove">Your move ({{turn}})</span>
        <span class="error" transition="slide" v-show="message">{{message}}</span>
      </h3>
      <div v-if="moves.length > 1" class="moveHistory">
        <button v-on:click="showMoves = !showMoves">
          Move History
        </button>
        <p v-if="showMoves" v-for="move in groupedMoves" class="move">
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
      gameStarted () {
        return this.players.white && this.players.black
      },
      isCheck () {
        return this.game.isCheck
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

  <style scoped>
  button {
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

  /*.white span + span {
    color: white;
  }

  .black span + span {
    color: rgba(20, 20, 20, 0.77);
    text-shadow: 0 0 4px #def, 0 0 0 #000, 1px 4px 6px #def;
  }*/

  .hidden {
    visibility: hidden;
  }

  .overlay {
    width: 600px;
    height: 600px;
    top: 0;
    position: absolute;
    display: flex;
    justify-content: space-around;
    background: rgba(33, 33, 33, 0.66);
  }

  .moveHistory {
    float: right;
    padding: 0 1em;
    margin-bottom: 64px;
    background: white;
  }

  .move {
    line-height: 1.5;
    font-size: calc(1em + 1vw);
    margin: 0 auto;
    font-weight: bold;
  }

  .error {
    width: 160px;
    float: right;
    color: #dd5555;
  }
</style>
