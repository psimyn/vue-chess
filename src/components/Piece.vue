<template>
  <span
    v-if="piece"
    v-bind:class="{side}"
    class="piece"
    v-bind:style="{
      'background-image': `url(${img})`,
      transform: `translate(${transform.x}px, ${transform.y}px)`
    }"
  >
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
    }
  },
  computed: {
    side () {
      return this.piece.side.name
    },
    img () {
      const color = this.piece.side.name
      return require(`../assets/${color}-${this.piece.type.toLowerCase()}.svg`)
    }
  }
}
</script>

<style>
.piece {
  font-weight: bold;
  font-size: 16px;
  text-shadow: 0 2px 2px white;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  pointer-events: none;
  z-index: 2;
}

.white {
  color: white;
  text-shadow: 0 1px 1px black;
}

</style>
