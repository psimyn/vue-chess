<template>
  <span
    v-if="piece"
    v-bind:class="side"
    class="piece-wrapper"
  >
    <span
      v-html="svg"
      width="20"
      height="20"
      class="piece"
      :class="{ selected }"
      v-bind:style="{
        transform: `translate(${transform.x}px, ${transform.y}px)`
      }"
    ></span>
  </span>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    piece: {
      type: Object
    },
    selected: {
      type: Boolean
    },
    transform: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    side({ piece }) {
      return piece.side.name;
    },
    svg({ piece, side }) {
      return require(`../assets/${side}-${piece.type.toLowerCase()}.svg`);
    }
  }
};
</script>

<style>
.piece {
  font-weight: bold;
  text-shadow: 0 2px 2px white;
  /* position: absolute; */
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  touch-events: none;
  z-index: 2;
  stroke-width: 6px;
  transition: transform 0.1s;
  margin: 0 auto;
}

.piece-wrapper {
  display: flex;
  flex: 1 1 auto;
  align-items: flex-start;
  pointer-events: none;
  touch-events: none;
}

.piece:active {
  position: absolute;
}

.selected {
  transition: none;
  z-index: 4;
}

.selected svg {
  transform: scale(1.4) translate(0, 0);
}

.white {
  color: white;
  stroke: black;
}
</style>
