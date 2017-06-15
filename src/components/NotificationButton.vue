<template>
  <button v-if="player.id" v-on:click="toggleSubscribe">
    {{verb}} push notifications
  </button>
</template>

<script>
  // eslint-env browser
  import {mapActions, mapGetters} from 'vuex'
  import Firebase from 'firebase'

  export default {
    data () {
      return {
        enabled: false
      }
    },
    created () {
      Firebase.messaging().getToken().then((currentToken) => {
        if (currentToken) {
          this.enabled = true
        }
      })
    },
    computed: {
      ...mapGetters({
        player: 'player'
      }),
      verb () {
        return this.enabled ? 'Disable' : 'Enable'
      }
    },
    methods: {
      ...mapActions(['saveToken', 'revokeToken']),
      toggleSubscribe () {
        if (this.enabled) {
          this.revokeToken()
          this.enabled = false
        } else {
          this.saveToken()
          this.enabled = true
        }
      }
    }
  }
</script>
