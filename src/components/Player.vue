<template>
  <div class="player-container">
    <div v-if="player.id">
      <div class="games" v-if="player.name && myGames.length">
        <h3>My Games</h3>
        <p class="link" v-for="game in myGames" v-on:click="loadGame(game.gameId)">
          {{game.white}} v {{game.black}}
        </p>
      </div>
      <hr />
      <div class="player-current-info">
        <span v-if="player.name">
          playing as {{player.name}}
        </span>
        <button v-on:click="signOut()">logout</button>
      </div>
      <hr />
    </div>
    <div class="login-section">
      <login />
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import GameLink from './GameLink.vue'
import Login from './Login.vue'

export default {
  components: {
    GameLink,
    Login,
  },
  computed: {
    ...mapGetters({
      player: 'player',
      game: 'game',
      playerId: 'playerId'
    }),
    myGames() {
      if (!this.player.games) return []
      const games = Object.keys(this.player.games).map((gameId) => ({
        gameId,
        white: this.player.games[gameId].white,
        black: this.player.games[gameId].black,
      }))
      return games
    },
    opponent () {
      return this.game.players
    },
    playerName () {
      return this.player.name
    },
    playerUrl () {
      const url = new URL(document.location)
      url.search = `pid=${this.player.id}`
      return url.href
    },
  },
  methods: {
    ...mapActions(['signOut', 'loadGame',])
  },
  data () {
    return {
      message: '',
      name: ''
    }
  },
}
</script>

<style>
  .games {
    padding: 16px 12px;
  }
  .link {
    color: #2a7ae2;
    cursor: pointer;
    text-decoration: none;
    background-image: linear-gradient(transparent 0,#2a7ae2 1px,#2a7ae2 4px);
    background-size: 4px 2px;
    background-repeat: repeat-x;
    background-position-y: 1.3125em;
    margin: 8px 0;
  }
  .players {
    overflow: hidden;
  }
  .player-current-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
  }
  .login-section {
    padding: 12px;
  }
  label {
    display: block;
  }
  .hide {
    height: 0;
    width: 0;
  }
</style>
