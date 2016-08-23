  <template>
    <div id="app">
      <div>
        <h3>
          <span v-if="false">Check!</span>
          <span>{{turn}} to move</span>
        </h3>
        <div>
          <div class="row" v-for="row in ranks">
            <square
              :square="square"
              :selected="square == selected"
              v-for="square in row.squares.filter(i => i != null)"
            >
            </square>
          </div>
        </div>
      </div>
      <div>
        <input @change="setName(playerName)" v-model="playerName" />
      </div>
    </div>
  </template>

<script>
  import Square from './Square.vue'
  import {mapActions, mapGetters, mapState} from 'vuex'
  import Chess from 'node-chess'

  export default {
    components: {
      Square,
    },
    computed: {
      ...mapGetters({
        selected: 'selected',
        boardState: 'boardState',
        playerName: 'playerName',
      }),
      turn () {
        return this.boardState.whitesTurn ? 'White' : 'Black'
      },
      ranks () {
        return this.boardState.ranks.filter(rank => rank != null)
      }
    },
    data() {
      return {
        showTitle: false,
        name: '',
      }
    },
    methods: mapActions(['selectSqaure', 'setName']),
  }
  </script>

  <style>
  body {
    font-family: Helvetica, sans-serif;
    margin: 0;
    overflow-y: hidden;
    background: #f2f2f2;
  }

  #app {
    max-height: 100vh;
    overflow-y: scroll;
  }

  .row {
    display: flex;
  }

  input {

  }

  button {
    border: solid 1px #222;
    border-bottom: solid 2px #888;
    background: white;
    line-height: 2;
    margin: 1em;
  }
</style>
