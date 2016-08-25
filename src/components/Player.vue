<template>
  <div>
    <fieldset>
      <label>Your name</label>
      <input v-on:keyup="setName(playerName)" v-model="playerName" />
    </fieldset>
    <div v-if="false">
      <h3>My Games</h3>
      <game-link
        v-bind:gameId="game"
        v-for="game in games"
      />
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
    }),
    games () {
      return this.player.games
    },
    playerName () {
      return this.player.name
    },
  },
  methods: mapActions(['setName']),
}
</script>

<style>
  fieldset {
    background: #fefefe;
    margin-top: 24px;
  }
  label {
    display: block;
  }
</style>
