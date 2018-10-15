  <template>
    <div id="app">
      <div
        class="container"
      >
        <transition name="slide">
          <board />
        </transition>

        <el-button
          type="text"
          round
          class="float-right"
          :class="{ top0: expanded }"
          :icon="expandIcon"
          @click="toggleExpanded"
        />

        <el-tabs
          type="border-card"
          :class="{ expanded }"
          class="chess-tabs"
        >
          <el-tab-pane label="Play">
            <status />
            <captured-pieces />
          </el-tab-pane>
          <el-tab-pane label="Analyze">
            <move-history></move-history>
          </el-tab-pane>
          <el-tab-pane label="My Games">
            <game-list />
          </el-tab-pane>
          <el-tab-pane label="Settings">
            <player
              v-if="!loading"
            />
          </el-tab-pane>
        </el-tabs>
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
    ...mapGetters({
      player: "player",
      game: "game",
      gameId: "gameId",
      moves: "moves",
      loading: "loading"
    }),
    players() {
      return this.game.players;
    },
    turn() {
      return this.moves.length % 2 === 1 ? "White" : "Black";
    },
    yourMove() {
      if (this.moves.length % 2 === 1) {
        return this.players.white === this.player.id;
      } else {
        return this.players.black === this.player.id;
      }
    },
    expandIcon() {
      return this.expanded ? "el-icon-arrow-down" : "el-icon-arrow-up";
    }
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    }
  }
};
</script>

  <style>
body {
  font-family: "Roboto", sans-serif;
  margin: 0;
  background: #f2f2f2;
  /* disabled pull-to-refresh */
  overscroll-behavior-y: none;
  height: 100vh;
  overflow: hidden;
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

.float-right {
  position: absolute;
  right: 0;
  z-index: 8;
}

.top0 {
  top: 0;
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

.chess-tabs {
  margin-top: 0;
  transition: max-height 0.1s ease-out, transform 0.1s ease-out;
  z-index: 7;
  position: absolute;
  width: 100%;
}

.el-tabs__content {
  overflow: auto;
}

.expanded {
  position: absolute;
  transform: translateY(calc(-100vw + 72px));
  left: 0;
  right: 0;
  z-index: 7;
}

.expanded .button {
  top: 0;
}
</style>
