<template>
  <div v-if="player.id">
    <input
      id="menu"
      type="checkbox"
      v-model="showMenu"
      v-bind:class="{open: showMenu}"
    />
    <div class="sidebar">
      <h2>Settings</h2>
      {{player.name}}
      <img v-bind:src="photoUrl" />
      <button v-on:click="signOut()">Logout</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import Player from './Player.vue'

export default {
  components: {
    Player,
  },
  computed: {
    ...mapGetters({
      player: 'player',
      game: 'game',
      playerId: 'playerId',
    }),
    photoUrl () {
      return this.player.photoUrl
    }
  },
  data () {
    return {
      showMenu: false,
    }
  },
  methods: {
    ...mapActions(['signOut']),
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
      showMenu: false,
      message: '',
    }
  },
}
</script>

<style>
  .sidebar {
    background: white;
    position: fixed;
    top: 0;
    right: 0;
    min-height: 100vh;
    width: 300px;

    box-shadow: -2px 0 3px 1px rgba(170, 170, 170, 0.2);
    transition: transform 0.2s ease;

    transform: translate(calc(100% - 56px), calc(100vh - 56px));
  }

  .sidebar h2 {
    padding: 0 16px;
    opacity: 0;
    transition: opacity 0.1s;
  }

  input:checked ~ .sidebar {
    transform: translate(0);
  }

  input:checked ~ .sidebar h2 {
    opacity: 1;
  }

  #menu {
    position: fixed;
    bottom: 0;
    right: 24px;
    z-index: 99;
    height: 0;
    font-size: 32px;
    line-height: 1.5;
  }

  #menu:after {
    content: '=';
    font-weight: bold;
    display: block;
    width: 56px;
    height: 56px;
    line-height: 56px;
    position: fixed;
    bottom: 0;
    right: 0;
    text-align: center;
  }

  #menu:checked:after {
    content: 'x';
    color: #dd6666;
  }
</style>
