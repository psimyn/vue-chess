  <template>
    <div id="app">
      <div
        class="container"
      >
        <transition name="slide">
          <board />
        </transition>

        <collapse-tabs />
      </div>
    </div>
  </template>

<script>
import Board from "./components/Board.vue";
import CollapseTabs from "./components/CollapseTabs.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Board,
    CollapseTabs
  },
  computed: {
    ...mapGetters({
      player: "player",
      game: "game",
      gameId: "gameId",
      moves: "moves",
      loading: "loading"
    })
  },
  methods: {
    ...mapActions(["loadGame"])
  },
  mounted() {
    let isNewGame;
    let gameId = document.location.hash.slice(1);
    this.loadGame(gameId);
  }
};
</script>

<style>
body {
  font-family: "Roboto", sans-serif;
  margin: 0;
  background: #f2f2f2;
  overflow-x: hidden;
}

/* todo: reset */
h3 {
  margin-bottom: 0;
}

p {
  margin: 0;
}

body * {
  font-family: "Roboto", sans-serif;
  font-size: 1em;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  perspective: 700px;
}

.row {
  display: flex;
}

button {
  border: solid 1px #222;
  border-bottom: solid 2px #888;
  background: white;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translate3d(0, -40%, 0);
}
</style>
