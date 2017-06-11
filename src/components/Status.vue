  <template>
    <div class="wrapper" id="currentGame">
      <div class="row">
        <h3 v-if="!gameStarted">Waiting for players...</h3>
        <h3 class="status" v-if="gameStarted">
          <span v-if="isCheck">Check!</span>
          <span v-if="yourMove">Your move ({{turn}})</span>
          <span v-if="!yourMove">{{turn}} to move</span>
          <span class="error" transition="slide" v-show="message">{{message}}</span>
        </h3>
        <span><strong>{{whiteName}}</strong> v <strong>{{blackName}}</strong></span>
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
        message: 'message'
      }),
      gameStarted() {
        return this.game.white && this.game.black
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
      }
    }
  }
  </script>

<style scoped>
  .wrapper {
    padding: 24px 12px 12px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .error {
    width: 160px;
    color: #dd5555;
    position: absolute;
    top: -4px;
    left: 0;
    padding: 4px 8px;
    background: #fff;
    border: solid 2px #dd5555;
  }

  .opponent {
    text-align: right;
    line-height: 32px;
  }

  .status,
  .title {
    margin: 0;
    position: relative;
    line-height: 32px;
  }
</style>
