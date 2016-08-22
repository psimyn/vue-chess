<template>
  <span>
    <span
      v-if="piece"
      :class="{white}"
      class="piece"
    >
      <img :src="img" />
    </span>
    <span v-if="!piece">
      &nbsp;
    </span>
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
      return require(`./assets/${color}-${this.piece.name.toLowerCase()}.svg`)
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
}

.white {
  color: white;
  text-shadow: 0 1px 1px black;
}

</style>
