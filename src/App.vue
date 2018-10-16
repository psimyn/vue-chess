  <template>
    <div id="app">
      <div
        class="container"
      >
        <transition name="slide">
          <board />
        </transition>

        <div
          class="collapse"
          :class="{ expanded }"
        >
          <el-button
            type="text"
            round
            class="float-right"
            :icon="expandIcon"
            @click="toggleExpanded"
          />

          <el-tabs
            type="border-card"
            class="chess-tabs"
          >
            <el-tab-pane label="Play">
              <status />
              <captured-pieces />
            </el-tab-pane>
            <el-tab-pane label="Analyze">
              <move-history></move-history>
            </el-tab-pane>
            <el-tab-pane
              label="My Games"
              lazy
            >
              <game-list />
            </el-tab-pane>
            <el-tab-pane
              label="Settings"
              lazy
            >
              <player />
              <h3>About</h3>
              Version: {{ version }}
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </template>

<script>
import Board from "./components/Board.vue";
import CapturedPieces from "./components/CapturedPieces.vue";
import Status from "./components/Status.vue";
import Player from "./components/Player.vue";
import GameList from "./components/GameList.vue";
import MoveHistory from "./components/MoveHistory.vue";
import Loader from "./components/Loader.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import querystring from "querystring";

function generateGameId() {
  return (Math.random() * new Date().getTime()).toString(36).slice(0, 6);
}

export default {
  components: {
    Board,
    CapturedPieces,
    GameList,
    Loader,
    MoveHistory,
    Player,
    Status
  },
  data() {
    return {
      expanded: false
    };
  },
  computed: {
    ...mapState({
      version: "version"
    }),
    ...mapGetters({
      player: "player",
      game: "game",
      gameId: "gameId",
      moves: "moves",
      loading: "loading"
    }),
    expandIcon() {
      return this.expanded ? "el-icon-arrow-down" : "el-icon-arrow-up";
    }
  },
  methods: {
    ...mapActions(["loadGame", "addMoves"]),
    toggleExpanded() {
      this.expanded = !this.expanded;
    }
  },
  mounted() {
    let isNewGame;
    let gameId = document.location.hash.slice(1);

    if (!gameId) {
      gameId = generateGameId();
      isNewGame = true;
    }

    this.loadGame(gameId);

    if (isNewGame) {
      const query = window.location.search.slice(1);
      let { moves = "" } = querystring.parse(query);
      store.dispatch("addMoves", moves.split(","));
    }
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
h3,
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

.collapse {
  position: relative;
}

.float-right {
  position: absolute;
  right: 0;
  z-index: 1;
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

.collapse {
  margin-top: 0;
  transition: max-height 0.1s ease-out, transform 0.1s ease-out;
  z-index: 7;
  position: absolute;
  width: 100%;
}

.el-tabs__content {
  overflow: auto;
  min-height: 2em;
}

.expanded {
  position: absolute;
  transform: translateY(calc(-100vmin + 40px));
  left: 0;
  right: 0;
  z-index: 7;
}

@media (min-width: 600px) and (min-height: 600px) {
  .expanded {
    transform: translateY(calc(-600px));
  }
}

.expanded .el-tabs {
  min-height: 100vh;
}
</style>
