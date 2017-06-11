<template>
  <span
    v-if="piece"
    v-bind:class="{side, flat}"
    class="piece"
    v-bind:style="{'background-image': `url(${img})`, transition}"
  >
  </span>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: ['piece'],
  computed: {
    ...mapGetters({flat: 'flat'}),
    side() {
      return this.piece.side.name
    },
    img() {
      const color = this.piece.side.name
      return require(`../assets/${color}-${this.piece.type.toLowerCase()}.svg`)
    },
    transition() {
      const random = Math.random() / 5
      return `transform ${0.4 - random}s cubic-bezier(0, 0.99, ${0.3 + random}, 1) ${0.1 + random}s`
    }
  },
  methods: {
  },
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
  z-index: 2;
  transition: transform 0.4s cubic-bezier(0, 0.99, 0.3, 1) 0.2s;
}

.piece:not(.flat) {
  transform: rotate3d(1, 0, 0, -15deg) translateY(-16%);
}


.piece:not(.flat):before {
  content: ' ';
  background-image: inherit;
  background-size: cover;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
}

.piece:not(.flat):after {
  content: ' ';
  background-image: inherit;
  background-size: cover;
  width: 100%;
  position: absolute;
  top: 2px;
  left: 4px;
  height: 100%;
  display: inline-block;
  transform: rotate(4deg) scaleY(1.05) translateY(-2px);
  filter: contrast(0) opacity(0.3) blur(2px);
}

.white {
  color: white;
  text-shadow: 0 1px 1px black;
}

</style>
