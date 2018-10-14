<template>
  <span
    class="square"
    :data-coord="`${square.file}${square.rank}`"
    :style="{
      backgroundColor
    }"
  >
    <div
      v-if="showLabel"
      class="square-label"
    >
      {{ square.rank }}{{ square.file }}
    </div>
    <piece
      v-bind:piece="square.piece"
      :selected="isSelected"
    />
  </span>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Piece from "./Piece.vue";

const bg = {
  selected: "#55bbee",
  previousSrc: "#ffedab",
  previousDest: "#ffed4b"
};

export default {
  components: {
    Piece
  },
  props: {
    square: {
      type: Object
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      previousMove: "previousMove",
      selected: "selected"
    }),
    isSelected() {
      return this.selected === `${this.square.file}${this.square.rank}`;
    },
    previousSrc() {
      return this.matches(this.previousMove.src);
    },
    previousDest() {
      return this.matches(this.previousMove.dest);
    },
    backgroundColor() {
      if (this.isSelected) {
        return bg.selected;
      }
      if (this.previousSrc) {
        return bg.previousSrc;
      }
      if (this.previousDest) {
        return bg.previousDest;
      }
    }
  },
  methods: {
    ...mapActions(["clickSquare", "selectSquare"]),
    matches(square = {}) {
      const { file, rank } = square;
      return this.square.file === file && this.square.rank === rank;
    }
  }
};
</script>

<style>
.square {
  cursor: pointer;
  text-align: center;
  vertical-align: top;
  background: white;
}

.square:hover {
  background: #88ccff !important;
}

.square:nth-child(-2n + 8),
.square:nth-child(8) ~ .square:nth-child(-2n + 15),
.square:nth-child(16) ~ .square:nth-child(-2n + 24),
.square:nth-child(24) ~ .square:nth-child(-2n + 31),
.square:nth-child(32) ~ .square:nth-child(-2n + 40),
.square:nth-child(40) ~ .square:nth-child(-2n + 47),
.square:nth-child(48) ~ .square:nth-child(-2n + 56),
.square:nth-child(56) ~ .square:nth-child(-2n + 63) {
  background: #aaa;
}

.square-label {
  position: absolute;
  opacity: 0.6;
}
</style>
