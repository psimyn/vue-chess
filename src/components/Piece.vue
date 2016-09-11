<template>
  <span
    v-if="piece"
    v-bind:class="{side}"
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

.3d .piece {
  transform: rotate3d(1, 0, 0, -30deg) scaleY(2.7) translateY(-31%);
}

.white {
  color: white;
  text-shadow: 0 1px 1px black;
}

</style>
