  <template>
    <div class="wrapper" id="currentGame">
      <h3 v-if="!gameStarted">Waiting for players...</h3>
      <h3 class="status" v-if="gameStarted">
        <span v-if="isCheck">Check!</span>
        <span v-if="yourMove">Your move ({{turn}})</span>
        <span v-if="!yourMove">{{turn}} to move</span>
        <span class="error" transition="slide" v-show="message">{{message}}</span>
      </h3>
      <div class="opponent" v-if="opponent">
        <h3 class="title">Opponent</h3>
        <span>{{opponent}}</span>
      </div>
    </div>
  </template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        player: 'player',
        players: 'players',
        game: 'game',
        moves: 'moves',
        message: 'message',
        currentMove: 'currentMove',
      }),
      gameStarted () {
        return this.game.white && this.game.black
      },
      opponent () {
        if (!(this.game && this.game.white && this.game.black)) return
        return this.players[this.game.white]
      },
      whiteName() {
        return this.players[this.game.white]
      },
      blackName() {
        return this.players[this.game.black]
      },
      isCheck () {
        return this.game.isCheck
      },
      turn () {
        return this.moves.length % 2 === 0 ? 'White' : 'Black'
      },
      yourMove () {
        if (this.moves.length % 2 === 0) {
          return this.game.white === this.player.id
        } else {
          return this.game.black === this.player.id
        }
      },
    },
  }
  </script>

<style scoped>
  .wrapper {
    padding: 24px 12px 12px;
    overflow: hidden;
  }
  .error {
    width: 160px;
    float: right;
    color: #dd5555;
  }

  .opponent {
    float: right;
    text-align: right;
  }

  .status,
  .title {
    margin: 0;
    line-height: 32px;
  }

  .status {
    float: left;
  }
</style>
