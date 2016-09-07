<template>
  <button class="button" v-on:click="signInWithGoogle()">
    <img class="icon" v-bind:src="GoogleIcon" />
    <span>Login with Google</span>
  </button>
</template>

<script>
import GoogleIcon from '../assets/google.svg'
import {mapActions} from 'vuex'

export default {
  data () {
    return {
      GoogleIcon,
    }
  },
  methods: {
    ...mapActions(['signInWithGoogle']),
  },
}


</script>


<style>
.button {
  display: flex;
  align-items: center;
}

.icon {
  width: 1.5em;
  height: 1.5em;
  padding: 0.5em;
}
</style>
