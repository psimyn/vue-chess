<template>
  <div
    class="player-container"
    v-loading="loadingGames"
  >
    <div v-if="player.id">
      <div
        v-if="player.name && myGames.length"
        class="games"
      >
        <p
          class="link"
          v-for="game in myGames"
          v-on:click="loadGame(game.gameId)"
          :key="game.gameId"
        >
          <span>{{game.white}} v {{game.black}}</span>
          <small>|&nbsp;&nbsp;{{game.gameId}}</small>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import GameLink from "./GameLink.vue";

export default {
  components: {
    GameLink
  },
  computed: {
    ...mapState({
      loadingGames: "loadingGames"
    }),
    ...mapGetters({
      player: "player",
      game: "game"
    }),
    myGames() {
      if (!this.player.games) return [];
      const games = Object.keys(this.player.games).map(gameId => ({
        gameId,
        white: this.player.games[gameId].white,
        black: this.player.games[gameId].black
      }));
      return games;
    },
    playerName() {
      return this.player.name;
    }
  },
  methods: {
    ...mapActions(["signOut", "loadGame", "updatePlayerGames"])
  },
  created() {
    this.updatePlayerGames(this.player.id);
  },
  data() {
    return {
      message: "",
      name: ""
    };
  }
};
</script>

<style scoped>
.games {
  padding: 16px 12px;
}

small {
  font-size: 0.7em;
}

.link {
  color: #2a7ae2;
  cursor: pointer;
  text-decoration: none;
  background-image: linear-gradient(transparent 0, #2a7ae2 1px, #2a7ae2 4px);
  background-size: 4px 2px;
  background-repeat: repeat-x;
  background-position-y: 1.3125em;
  margin: 8px 0;
}
.players {
  overflow: hidden;
}
</style>
