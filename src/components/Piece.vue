<template>
  <span
    v-if="piece"
    v-bind:class="{side, flat}"
    class="piece"
    v-bind:style="{'background-image': `url(${img})`}"
  >
  </span>
</template>

<script>
export default {
  props: ['piece'],
  computed: {
    side() {
      return this.piece.side.name
    },
    flat() {
      return true
    },
    img() {
      const color = this.piece.side.name
      return require(`../assets/${color}-${this.piece.type.toLowerCase()}.svg`)
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
}

.piece:not(.flat) {
  transform: rotate3d(1, 0, 0, -25deg) translateY(-18%);
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
