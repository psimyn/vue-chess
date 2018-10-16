<template>
  <div>
    <div id="firebaseui-auth-container"></div>

    <el-row v-if="player.isAnonymous">
    </el-row>
  </div>
</template>

<style>
@import "../../node_modules/firebaseui/dist/firebaseui.css";
</style>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      player: "player"
    })
  },
  mounted() {
    this.initLogins();
  },
  methods: {
    ...mapActions(["initLogins"])
  },
  data() {
    return {
      showUrl: false,
      showMenu: false,
      message: ""
    };
  }
};
</script>

<style scoped>
.name-form {
  display: flex;
}
</style>
