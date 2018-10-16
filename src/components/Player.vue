<template>
  <div class="player-container">
    <div v-if="player.id">
      <div class="player-current-info">
        <span v-if="player.name">
          Playing as {{player.name}} 
          <el-button
            type="text"
            @click="editName = true"
          >
            edit name
          </el-button>
        </span>
        <el-button
          v-if="!player.isAnonymous"
          @click="signOut()"
        >
          Logout
        </el-button>
      </div>
    </div>
    <div v-if="editName">
      <h3>Display Name</h3>
      <div class="name-form">
        <input type="text" v-model="name" />
        <el-button
          type="primary"
          @click="setName(name)"
        >
          Save
        </el-button>
        <el-button
          @click="editName = false"
        >
          Cancel
        </el-button>
      </div>
      <p class="helptext">This is publicly visible</p>
    </div>
    <div class="login-section">
      <login />
    </div>
    <div class="login-section">
      <h3>Notifications</h3>
      <notification-button />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import GameLink from "./GameLink.vue";
import Login from "./Login.vue";
import NotificationButton from "./NotificationButton.vue";

export default {
  components: {
    GameLink,
    Login,
    NotificationButton
  },
  computed: {
    ...mapGetters({
      player: "player",
      game: "game"
    }),
    playerName() {
      return this.player.name;
    },
    playerUrl() {
      const url = new URL(document.location);
      url.search = `pid=${this.player.id}`;
      return url.href;
    }
  },
  methods: {
    ...mapActions(["setPlayerName", "signOut"]),
    setName() {
      this.setPlayerName(this.name);
      this.editName = false;
    }
  },
  data() {
    return {
      message: "",
      name: "",
      editName: false
    };
  },
  mounted() {
    this.name = this.$store.getters.player.name;
  }
};
</script>

<style>
.games {
  padding: 16px 12px;
}
.link {
  color: #2a7ae2;
  cursor: pointer;
  text-decoration: none;
  background-image: linear-gradient(transparent 0, #2a7ae2 1px, #2a7ae2 4px);
  background-size: 4px 2px;
  background-repeat: repeat-x;
  background-position-y: 1.3125em;
  margin: 8px 0;
}
.players {
  overflow: hidden;
}
.player-current-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
}
.login-section {
  margin: 24px 0;
}
label {
  display: block;
}
.hide {
  height: 0;
  width: 0;
}
</style>
