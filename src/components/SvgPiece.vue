<template>
  <span
    v-html="svg"
    class="svg-piece"
  ></span>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    piece: {
      type: String
    },
    side: {
      type: String
    }
  },
  computed: {
    svg({ piece, side }) {
      return require(`../assets/${side}-${piece}.svg`);
    }
  }
};
</script>

<style>
.svg-piece {
  font-weight: bold;
  font-size: 16px;
  text-shadow: 0 2px 2px white;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  touch-events: none;
  z-index: 2;
  stroke-width: 6px;
  transition: transform 0.1s;
}

.piece:active {
  position: absolute;
}

.selected {
  transition: none;
  z-index: 4;
}

@media (min-width: 600px) {
  svg {
    transform: scale(1.2) translate(0, 25%);
  }
}

.selected svg {
  transform: scale(1.4) translate(0, 0);
}

.white {
  color: white;
  stroke: black;
}
</style>
