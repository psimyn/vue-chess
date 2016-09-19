<template>
  <div class="player-container">
    <login v-if="!player.id && !player.name" />
    <div v-if="player.id">
      <div class="games" v-if="player.name && myGames.length">
        <h2>My Games</h2>
        <p class="link" v-for="game in myGames" v-on:click="loadGame(game.gameId)">
          {{game.white}} v {{game.black}}
        </p>
        <hr />
      </div>
      <div v-if="!player.name || edit">
        <p>Please enter your name</p>
        <input v-model="name" />
        <button v-on:click="saveName">Update name</button>
      </div>
      <div v-if="player.name && !edit">
        <span>logged in as {{player.name}} </span>
        <a class="link" v-on:click="editName">edit</a>
      </div>
      <notification-button />
      <button class="right" v-on:click="signOut()">Logout</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import NotificationButton from './NotificationButton.vue'
import GameLink from './GameLink.vue'
import Login from './Login.vue'

export default {
  components: {
    GameLink,
    Login,
    NotificationButton,
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
    ...mapActions(['signOut', 'loadGame', 'setPlayerName',]),
    saveName() {
      this.setPlayerName(this.name)
      this.edit = false
    },
    editName() {
      this.name = this.player.name
      this.edit = true
    }
  },
  data () {
    return {
      message: '',
      name: '',
      edit: false,
    }
  },
}
</script>

<style>
  .link {
    color: #2a7ae2;
    cursor: pointer;
    text-decoration: none;
    background-image: linear-gradient(transparent 0,#2a7ae2 1px,#2a7ae2 4px);
    background-size: 4px 2px;
    background-repeat: repeat-x;
    background-position-y: 1.3125em;
    margin: 0 24px;
  }
  .games{
    margin: 32px 0;
  }
  .players {
    overflow: hidden;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  label {
    display: block;
  }
  .hide {
    height: 0;
    width: 0;
  }
</style>
