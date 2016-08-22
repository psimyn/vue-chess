  <template>
    <div id="app">
      <div>
        <!-- <h2>
          <span v-if="!showTitle">{{gameTitle}}</span>
          <input v-if="showTitle" :value="gameTitle" @keyup="setTitle" />
          <label>&#x1f589;<input style="display: none" type="checkbox" v-model="showTitle" /></label>
        </h2> -->
        {{things}}
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
    computed: {...mapGetters({
      ranks: 'ranks',
      moves: 'moves',
      selected: 'selected',
      turn: 'turn',
      things: 'things',
    }),
    // computed: {
    //   ...mapState({
    //     'moves': state => state.moves,
    //     'selected': state => state.selected,
    //     'turn': state => state.turn
    //   }),
    //   turn () {
    //
    //   },
      ranks () {
        const game = Chess.classic.engine()
        this.moves.forEach((move) => {
          game.movePiece(move)
        })
        return game.boardState.ranks.filter(rank => rank != null)
      }
    },
    data() {
      return {
        showTitle: false,
      }
    },
    methods: mapActions(['selectSqaure']),
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
