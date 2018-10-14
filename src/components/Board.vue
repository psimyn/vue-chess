<template>
  <div>
    <div
      class="board"
      v-loading="loading"
      :class="{
        playingAsBlack
      }"
    >
      <square
        :key="`${s.file}${s.rank}`"
        v-for="s of board.squares"
        :square="s"
      />
      <div
        v-if="!gameStarted && !loading"
        class="overlay"
      >
        <svg-piece class="mascot white" side="white" piece="knight" />
        <svg-piece class="mascot black" side="black" piece="knight" />
        <button
          class="button white"
          v-bind:class="{
            hidden: game && game.white
          }"
          v-on:click="joinTeam('white')"
        >
          <span>Play as</span>&nbsp;<span>White</span>
        </button>
        <button
          class="button black"
          v-bind:class="{
            hidden: game.black
          }"
          v-on:click="joinTeam('black')"
        >
          <span>Play as</span>&nbsp;<span>Black</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SvgPiece from "./SvgPiece.vue";
import Piece from "./Piece.vue";
import Square from "./Square.vue";
import { mapActions, mapGetters } from "vuex";

let updating;

export default {
  components: {
    Square,
    SvgPiece
  },
  computed: {
    ...mapGetters({
      selected: "selected",
      board: "board",
      game: "game",
      players: "players",
      loading: "loading"
    }),
    // todo: determine, default to false
    playingAsBlack() {
      return false;
    },
    gameStarted() {
      return this.game.white && this.game.black;
    }
  },
  methods: {
    ...mapActions(["joinTeam"])
  }
};
</script>

<style scoped>
.board {
  --square-size: calc(600px / 8);
  background: rgba(88, 88, 88, 0.05);
  margin: 0 auto;
  max-width: 600px;
  max-height: 600px;
  width: 100vmin;
  height: 100vmin;
  display: grid;
  grid-gap: 0;
  grid-template-rows: repeat(8, minmax(40px, 1fr));
  grid-template-columns: repeat(8, 1fr);
  box-shadow: 0 1px 2px rgba(22, 22, 22, 0.2);
  position: relative;
  transition: transform 0.4s cubic-bezier(0, 0.99, 0.3, 1);
}

.playingAsBlack {
  flex-direction: column;
}

.row {
  display: flex;
}

.hidden {
  visibility: hidden;
}

.overlay {
  top: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(233, 233, 233, 0.9);
  z-index: 2;
  padding: 24px;
  display: flex;
  align-items: flex-start;
}

.button {
  color: #333;
  border: none;
  font-size: calc(1em + 1vw);
  font-weight: bold;
  padding: 0.5em 1em;
  box-shadow: 0 0 2px 2px rgba(24, 24, 24, 0.4);
  margin: auto 0 0;
}

.black {
  margin-left: auto;
}

.checkmate {
  flex-grow: 1;
  font-size: 3em;
  color: white;
  text-align: center;
}

.mascot {
  transform: scale(4) translate(0, 0) rotate(10deg);
  margin-left: 0;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -25%;
}

.mascot.white {
  transform: scale(10) rotate(25deg) rotateY(180deg);
  margin-left: -50%;
}

.mascot.black {
  left: auto;
  transform: scale(10) rotateZ(-25deg);
}
</style>
