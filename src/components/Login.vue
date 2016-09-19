<template>
  <div>
    <button class="button" v-on:click="signInWithGoogle()">
      <img class="icon" v-bind:src="GoogleIcon" />
      <span>Login with Google</span>
    </button>
    <button v-on:click="signInAnonymously">
      Login as Guest
    </button>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import GoogleIcon from '../assets/google.svg'

export default {
  computed: {
    ...mapGetters({
      player: 'player',
      game: 'game',
      playerId: 'playerId',
    }),
  },
  methods: {
    ...mapActions(['signInWithGoogle', 'signInAnonymously']),
  },
  data () {
    return {
      showUrl: false,
      showMenu: false,
      message: '',
      GoogleIcon,
    }
  },
}
</script>

<style scoped>
  .button {
    display: flex;
    align-items: center;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
    padding: 0.5em;
  }
</style>
