<template>
  <span
    v-if="piece"
    v-bind:class="side"
  >
    <span
      v-html="svg"
      class="piece"
      :class="{ selected }"
      v-bind:style="{
        transform: `translate(${transform.x}px, ${transform.y}px)`
      }"
    ></span>
  </span>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    piece: {
      type: Object
    },
    transform: {
      type: Object,
      required: false,
      default: () => ({})
    },
    selected: {
      type: Boolean
    }
  },
  computed: {
    side ({ piece }) {
      return piece.side.name
    },
    svg ({ piece, side }) {
      return require(`../assets/${side}-${piece.type.toLowerCase()}.svg`)
    },
    pieceScale ({ piece }) {
      return {
        pawn: 1,
        knight: 1.2,
        rook: 1.2,
        bishop: 1.2,
        queen: 1.25,
        king: 1.35
      }[piece.type] || 1
    }
  }
}
</script>

<style>
.piece {
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

.selected {
  transition: none;
  z-index: 4;
}

svg {
  transform: scale(1) translate(0, 25%);
}

.selected svg {
  transform: scale(1.4) translate(0, 0);
}

.white {
  color: white;
  stroke: black;
}
</style>
