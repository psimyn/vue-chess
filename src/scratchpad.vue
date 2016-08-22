<template>
  <div id="app">
    <wonder-input label="Input" />
    <h1 :style="{ color }">{{ title }}</h1>
    <h2 class="subheader" :class="{ big }">{{ reversedTitle }}</h2>
    <p v-if="color === 'red'">red</p>
    <input v-model="title">
    <ol>
      <li v-for="todo in todos">
        {{ todo.text }}
      </li>
    </ol>
    <button v-on:click="reverse">Reverse</button>
    <button @click="colorise">Change color</button>
    <button @click="embiggen">Change size</button>
    {{name}}
    <form v-on:submit="handleSubmit">
      <div>
        <label for="name">Name</label>
        <input v-model="name" />
        <p v-if="nameError">{{nameError}}</p>
      </div>
      <div>
        <label>Number</label>
        <input v-model.number="number" />
        <p>Value: {{ number }}</p>
      </div>
      <div>
        <label>Lazy Number</label>
        <input v-model.number.lazy="lazyNumber" />
        <p>Value: {{ lazyNumber }}</p>
      </div>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import Input from './Input.vue'

export default {
  components: {
    'wonder-input': Input
  },
  data () {
    return {
      name: '',
      title: 'test',
      number: null,
      lazyNumber: null,
      color: 'black',
      big: false,
      todos: [{text: 'hi'}, {text: 'vue'}]
    }
  },
  computed: {
    reversedTitle() {
      return this.title.split('').reverse().join('')
    },
    nameError() {
      if (/[0-9]/.test(this.name)) {
        return 'Letters only, please'
      }
    }
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault()
    },
    reverse: function () {
      this.title = this.title.split('').reverse().join('')
    },
    colorise() {
      this.color = this.color === 'red' ? 'black' : 'red'
    },
    embiggen() {
      this.big = !this.big
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
.big {
  font-size: 2em;
}
</style>
