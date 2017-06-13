<template>
  <div>
    <div v-if="!player.id">
      <button class="login-button" v-on:click="signInWithGoogle()">
        <img class="icon" v-bind:src="GoogleIcon" />
        <span>Login with Google</span>
      </button>
      <button class="login-button" v-on:click="signInAnonymously">
        login as Guest
      </button>
    </div>
    <div v-else>
      <h3>your name</h3>
      <div class="name-form">
        <input type="text" v-model="name" />
        <button v-on:click="setPlayerName(name)">save</button>
      </div>
      <p class="helptext">This is publicly visible</p>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import GoogleIcon from '../assets/google.svg'

export default {
  computed: {
    ...mapGetters({
      player: 'player',
      game: 'game',
      playerId: 'playerId'
    })
  },
  methods: {
    ...mapActions(['signInWithGoogle', 'signInAnonymously', 'setPlayerName'])
  },
  data () {
    return {
      name: '',
      showUrl: false,
      showMenu: false,
      message: '',
      GoogleIcon
    }
  }
}
</script>

<style scoped>
  .login-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 240px;
    margin: 24px auto;
  }

  .name-form {
    display: flex;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
    padding: 0.5em;
  }
</style>
