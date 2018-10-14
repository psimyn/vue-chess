  <template>
    <div>
      <div
        v-if="moves.length > 0"
        class="moveHistory"
      >
        <h3>Move History</h3>

        <el-button
          type="secondary"
          icon="el-icon-d-arrow-left"
          title="First move"
          data-test="firstMove"
          @click.native="setCurrentMove(0)"
          :disabled="currentMove === 0"
        />
        <el-button
          type="secondary"
          icon="el-icon-arrow-left"
          title="Previous Move"
          data-test="prevMove"
          @click.native="setCurrentMove(currentMove - 1)"
          :disabled="currentMove === 0"
        />
        <el-button
          type="secondary"
          icon="el-icon-arrow-right"
          title="Next Move"
          data-test="nextMove"
          @click.native="setCurrentMove(currentMove + 1)"
          :disabled="currentMove === moves.length - 1"
        />
        <el-button
          type="secondary"
          icon="el-icon-d-arrow-right"
          title="Last Move"
          data-test="lastMove"
          @click.native="setCurrentMove(moves.length - 1)"
          :disabled="currentMove === moves.length - 1"
        />

        <a :href="newGameUrl">New game from here</a>
        <div class="move-history-list">
          <div class="slider">
            <div v-bind:style="{top}" class="slider-knob">
            </div>
          </div>
          <p
            v-for="move in groupedMoves"
            class="move"
            :key="move.number"
          >
            <span>{{move.number}}.</span>
            <span 
              :class="{active: move.white.index === currentMove}"
              @click="setCurrentMove(move.white.index)"
            >
              {{move.white.pge}}
            </span>
            <span
              v-if="move.black"
              :class="{active: move.black.index === currentMove}"
              @click="setCurrentMove(move.black.index)"
            >
              {{move.black.pge}}
            </span>
          </p>
        </div>
      </div>
    </div>
  </template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {},
  data() {
    return {
      current: 0
    };
  },
  methods: mapActions(["setCurrentMove"]),
  computed: {
    ...mapGetters({
      moves: "moves",
      currentMove: "currentMove"
    }),
    newGameUrl() {
      const moveList = this.moves.slice(0, this.currentMove + 1).join(",");
      return `?moves=${moveList}`;
    },
    top() {
      const value = (this.currentMove / this.moves.length) * 100;
      return `${value}%`;
    },
    turn() {
      return this.moves.length % 2 === 0 ? "White" : "Black";
    },
    groupedMoves() {
      return this.moves.reduce((moveList, move, index) => {
        const moveIndex = Math.floor(index / 2);
        const moveNumber = moveIndex + 1;
        moveList[moveIndex] = moveList[moveIndex] || { number: moveNumber };
        if (index % 2 === 0) {
          moveList[moveIndex].white = {
            pge: move,
            index
          };
        } else {
          moveList[moveIndex].black = {
            pge: move,
            index
          };
        }
        return moveList;
      }, []);
    }
  }
};
</script>

  <style scoped>
.button {
  border: none;
  font-size: 1.2em;
  font-weight: bold;
  padding: 0 1em;
  background: rgba(20, 20, 20, 0.77);
  color: white;
  box-shadow: 0 0 2px 2px rgba(24, 24, 24, 0.4);
  text-shadow: 0 0 1px #333;
}

.moveHistory {
  padding: 24px 16px 24px 12px;
  margin-bottom: 0;
  background: white;
}

.move-history-list {
  position: relative;
  padding: 16px 16px 0 24px;
}

.slider {
  position: absolute;
  background: #bbb;
  left: 0;
  top: 12px;
  bottom: 0;
  width: 4px;
}

.slider-knob {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: solid 1px #aaa;
  background: #aaa;
  top: 0;
  left: -10px;
}

.move {
  line-height: 1.5;
  font-size: calc(1em + 1vw);
  margin: 0 auto;
  font-weight: bold;
}

.active {
  color: green;
}

.error {
  width: 160px;
  float: right;
  color: #dd5555;
}
</style>
