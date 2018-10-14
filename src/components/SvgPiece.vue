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
  width: 12.5%;
  height: 12.5%;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 0 2px 2px white;
  position: absolute;
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

.white {
  color: white;
  stroke: black;
}
</style>
