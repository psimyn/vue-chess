  <template>
    <div>
      <div
        v-if="moves.length > 0"
        class="moveHistory"
      >
        <h3>Move History</h3>
        <div class="move-history-list">
          <div class="slider">
            <div v-bind:style="{top}" class="slider-knob">
            </div>
          </div>
          <p v-for="move in groupedMoves" class="move">
            <span>{{move.number}}.</span>
            <span v-bind:class="{active: move.white.active}">{{move.white.pge}}</span>
            <span v-if="move.black" v-bind:class="{active: move.black.active}">{{move.black.pge}}</span>
          </p>
        </div>
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
        current: 0
      }
    },
    methods: mapActions(['setCurrentMove']),
    computed: {
      ...mapGetters({
        player: 'player',
        game: 'game',
        moves: 'moves',
        message: 'message',
        currentMove: 'currentMove'
      }),
      top () {
        const value = this.currentMove / this.moves.length * 100
        return `${value}%`
      },
      players () {
        return this.game.players
      },
      gameStarted () {
        return this.players.white && this.players.black
      },
      gameOver () {
        return false
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
          moveList[moveIndex] = moveList[moveIndex] || {number: moveNumber}
          if (index % 2 === 0) {
            moveList[moveIndex].white = {
              pge: move,
              active: index === this.currentMove
            }
          } else {
            moveList[moveIndex].black = {
              pge: move,
              active: index === this.currentMove
            }
          }
          return moveList
        }, [])
      },
      yourMove () {
        if (this.moves.length % 2 === 0) {
          return this.players.white === this.player.id
        } else {
          return this.players.black === this.player.id
        }
      }
    }
  }
  </script>

  <style scoped>
  .button {
    border: none;
    font-size: 1.2em;
    font-weight: bold;
    padding: 0 1em;
    background: rgba(20, 20, 20, 0.77);
    color: white;
    box-shadow: 0 0 2px 2px rgba(24, 24, 24, 0.4);
    text-shadow: 0 0 1px #333;
  }

  .moveHistory {
    max-height: 100vh;
    overflow-y: auto;
    padding: 24px 16px 24px 12px;
    margin-bottom: 0;
    background: white;
  }

  .move-history-list {
    position: relative;
    padding: 16px 16px 0 24px;
  }

  .slider {
    position: absolute;
    background: #bbb;
    left: 0;
    top: 12px;
    bottom: 0;
    width: 4px;
  }

  .slider-knob {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: solid 1px #aaa;
    background: #aaa;
    top: 0;
    left: -10px;
  }

  .move {
    line-height: 1.5;
    font-size: calc(1em + 1vw);
    margin: 0 auto;
    font-weight: bold;
  }

  .active {
    color: green;
  }

  .error {
    width: 160px;
    float: right;
    color: #dd5555;
  }
</style>
