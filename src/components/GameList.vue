<template>
  <div class="player-container">
    <div v-if="player.id">
      <div class="games" v-if="player.name && myGames.length">
        <p class="link" v-for="game in myGames" v-on:click="loadGame(game.gameId)">
          {{game.white}} v {{game.black}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import GameLink from './GameLink.vue'

export default {
  components: {
    GameLink,
  },
  computed: {
    ...mapGetters({
      player: 'player',
      game: 'game',
      playerId: 'playerId'
    }),
    myGames () {
      if (!this.player.games) return []
      const games = Object.keys(this.player.games).map((gameId) => ({
        gameId,
        white: this.player.games[gameId].white,
        black: this.player.games[gameId].black
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
    }
  },
  methods: {
    ...mapActions(['signOut', 'loadGame'])
  },
  data () {
    return {
      message: '',
      name: ''
    }
  }
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
</style>
