<template>
  <span
    v-if="piece"
    v-bind:class="{white}"
    class="piece"
    v-bind:style="{'background-image': `url(${img})`}"
  >
  </span>
</template>

<script>
export default {
  props: ['piece'],
  computed: {
    white() {
      return this.piece.isWhite
    },
    img() {
      const color = this.piece.isWhite ? 'white' : 'black'
      return require(`../assets/${color}-${this.piece.name.toLowerCase()}.svg`)
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
}

.white {
  color: white;
  text-shadow: 0 1px 1px black;
}

</style>
