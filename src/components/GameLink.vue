<template>
  <p>
    <a
      v-bind:href="link"
    >
      {{gameId}}
    </a>
  </p>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["gameId"],
  computed: {
    link() {
      return "/#" + this.gameId;
    }
  }
};
</script>

<style>
</style>
