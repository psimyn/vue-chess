<template>
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
      value="play"
      :before-leave="resetCurrentMove"
    >
      <el-tab-pane
        label="Play"
        name="play"
      >
        <status />
        <captured-pieces />
      </el-tab-pane>
      <el-tab-pane
        label="Analyze"
        name="analyze"
        :disabled="moves.length === 0"
      >
        <move-history></move-history>
      </el-tab-pane>
      <el-tab-pane
        label="My Games"
        name="games"
        lazy
      >
        <game-list />
      </el-tab-pane>
      <el-tab-pane
        label="Settings"
        name="settings"
        lazy
      >
        <player />
        <h3>About</h3>
        Version: {{ version }}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CapturedPieces from "./CapturedPieces.vue";
import Status from "./Status.vue";
import Player from "./Player.vue";
import GameList from "./GameList.vue";
import MoveHistory from "./MoveHistory.vue";
import Loader from "./Loader.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {
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
      moves: "moves"
    }),
    expandIcon() {
      return this.expanded ? "el-icon-arrow-down" : "el-icon-arrow-up";
    }
  },
  methods: {
    ...mapActions(["setCurrentMove"]),
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    resetCurrentMove(activeName, oldActiveName) {
      if (activeName === "play") {
        this.setCurrentMove();
      }
    }
  }
};
</script>

<style>
.collapse {
  position: relative;
}

.float-right {
  position: absolute;
  right: 0;
  z-index: 1;
}

.collapse {
  margin-top: 0;
  transition: min-height 0.1s ease-out 0.1s, transform 0.1s ease-out;
  z-index: 7;
  position: absolute;
  width: 100%;
}

.el-tabs__content {
  overflow: auto;
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

.el-tabs {
  transition: min-height 0.1s ease-out 0.1s;
  min-height: 8em;
}

.expanded .el-tabs {
  transition: none;
  min-height: 100vh;
}
</style>
