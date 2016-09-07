<template>
  <div>
    <google-button />
  </div>
</template>

<script>
import GoogleButton from './Button.vue'
import {mapActions, mapGetters, mapState} from 'vuex'
import Player from './Player.vue'

export default {
  components: {
    Player,
    GoogleButton,
  },
  computed: {
    ...mapGetters({
      player: 'player',
      game: 'game',
      playerId: 'playerId',
    }),
  },
  data () {
    return {
      showMenu: false,
    }
  },
  methods: {
    ...mapActions(['signInWithGoogle']),
  },
  data () {
    return {
      showUrl: false,
      showMenu: false,
      message: '',
    }
  },
}
</script>

<style scoped>
  .google-login {

  }
</style>
