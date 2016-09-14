<template>
  <div class="player-container">
    <div class="players">
      <span v-if="false" class="right">
        <label>Opponent</label>
        <span>{{opponent}}</span>
      </span>

      <button class="right" v-on:click="signOut()">Logout</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
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
    ...mapActions(['signOut']),
  },
  data () {
    return {
      message: '',
    }
  },
}
</script>

<style>
  .player-container {
    padding: 16px;
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
  textarea {
    display: block;
    width: 100%;
    padding: 0;
    outline: none;
    border: none;
  }
  .hide {
    height: 0;
    width: 0;
  }
</style>
