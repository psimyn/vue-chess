<template>
  <div>
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

    <div id="firebaseui-auth-container"></div>

    <el-row v-if="player.isAnonymous">
    </el-row>
  </div>
</template>

<style>
  @import "../../node_modules/firebaseui/dist/firebaseui.css";
</style>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters({
      player: 'player',
      game: 'game',
      playerId: 'playerId'
    }),
  },
  mounted() {
    this.initLogins()
  },
  methods: {
    ...mapActions(['initLogins', 'setPlayerName'])
  },
  data () {
    return {
      name: '',
      showUrl: false,
      showMenu: false,
      message: '',
    }
  }
}
</script>

<style scoped>
  .name-form {
    display: flex;
  }
</style>
