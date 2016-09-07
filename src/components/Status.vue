  <template>
    <div id="">
      <h3 v-if="!gameStarted">Waiting for players...</h3>
      <h3 v-if="gameStarted">
        <span v-if="isCheck">Check!</span>
        <span v-if="yourMove">Your move ({{turn}})</span>
        <span class="error" transition="slide" v-show="message">{{message}}</span>
      </h3>
      <move-history />
    </div>
  </template>

<script>
  import MoveHistory from './MoveHistory.vue'
  import {mapActions, mapGetters, mapState} from 'vuex'

  export default {
    components: {
      MoveHistory,
    },
    computed: {
      ...mapGetters({
        player: 'player',
        game: 'game',
        moves: 'moves',
        message: 'message',
        currentMove: 'currentMove',
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
      yourMove () {
        if (this.moves.length % 2 === 0) {
          return this.players.white === this.player.id
        } else {
          return this.players.black === this.player.id
        }
      },
    },
  }
  </script>

  <style scoped>
  .error {
    width: 160px;
    float: right;
    color: #dd5555;
  }
</style>
