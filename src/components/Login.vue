<template>
  <div>
{{ player.id }}

    <div>
      <h3>your name</h3>
      <div class="name-form">
        <input type="text" v-model="name" />
        <el-button
          v-on:click="setPlayerName(name)"
        >
          Save
        </el-button>
      </div>
      <p class="helptext">This is publicly visible</p>
    </div>

    <el-row v-if="player.isAnonymous">
      <el-button
        icon="icon-google"
        class="login-button"
        @click="signInWithGoogle()"
      >
        <span>Login with Google</span>
      </el-button>
    </el-row>
  </div>
</template>

<style>
  .icon-google {
     background-image: url(../assets/google.svg);
     margin-right: 8px;
     height: 24px;
     width: 24px;
  }
</style>

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
    padding: 12px;
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
