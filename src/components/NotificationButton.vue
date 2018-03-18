<template>
  <el-switch
    v-if="player.id"
    v-model="enabled"
    @change="toggleSubscribe"
    active-text="Move Notifications"
  />
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
          this.saveToken()
        } else {
          this.revokeToken()
        }
      }
    }
  }
</script>
