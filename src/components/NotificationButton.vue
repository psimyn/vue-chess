<template>
  <el-switch
    v-if="player.id"
    v-model="enabled"
    @change="toggleSubscribe"
    active-text="Move Notifications"
  />
</template>

<script>
// eslint-env browser
import { mapActions, mapGetters } from "vuex";
import { messaging } from "../store/firebase";

export default {
  data() {
    return {
      enabled: false
    };
  },
  created() {
    try {
      messaging.getToken().then(currentToken => {
        if (currentToken) {
          this.enabled = true;
        }
      });
    } catch (e) {
      console.warn("No messaging", e);
    }
  },
  computed: {
    ...mapGetters({
      player: "player"
    }),
    verb() {
      return this.enabled ? "Disable" : "Enable";
    }
  },
  methods: {
    ...mapActions(["saveToken", "revokeToken"]),
    toggleSubscribe() {
      try {
        if (this.enabled) {
          this.saveToken();
        } else {
          this.revokeToken();
        }
      } catch (e) {
        console.warn("No messaging", e);
      }
    }
  }
};
</script>
