<template>
  <div class="player-container">
    <div class="players">
      <span class="left">
        <label>Your name</label>
        <input v-on:keyup="setName(playerName)" v-model="playerName" />
      </span>

      <span v-if="false" class="right">
        <label>Opponent</label>
        <span>{{opponent}}</span>
      </span>
    </div>

    <div>
      <p>To play from another browser or device, click the button to get the link with your Player ID</p>
      <button v-if="!showUrl" v-on:click="showUrl = !showUrl">
        Show secret link
      </button>
      <button v-if="showUrl" v-on:click="copy">Copy URL</button>
      <p v-if="message">{{message}}</p>
      <textarea v-if="showUrl" id="playerUrl">{{playerUrl}}</textarea>
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
    ...mapActions(['setName']),
    copy () {
      const text = document.querySelector('#playerUrl')
      text.select()
      let res
      try {
        res = document.execCommand('copy')
      } catch (e) {
        res = false
      }
      if (res) {
        this.showUrl = false
        this.message = 'Url copied to clipboard!'
        window.setTimeout(() => {
          this.message = ''
        }, 2000)
      }
    },
  },
  data () {
    return {
      showUrl: false,
      message: '',
    }
  },
}
</script>

<style>
  .player-container {
    padding: 16px;
    min-height: 100vh;
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
