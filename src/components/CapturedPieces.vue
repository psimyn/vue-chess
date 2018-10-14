  <template>
    <div>
      <div
        v-for="color in ['white', 'black']"
        class="captureRow"
      >
        <div
          v-for="piece in captured(color)"
          class="pen"
        >
          <el-piece :piece="piece" />
        </div>
      </div>
    </div>
  </template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import ElPiece from "./Piece.vue";

export default {
  components: {
    ElPiece
  },
  methods: {
    ...mapActions(["setCurrentMove"]),
    captured(color) {
      const order = ["queen", "rook", "bishop", "knight", "pawn"];
      const pieces = this.capturedPieces[color];

      const orderedPieces = order.reduce((acc, type) => {
        const captured = pieces.filter(p => p.type === type);
        return acc.concat(...captured);
      }, []);

      return orderedPieces;
    }
  },
  computed: {
    ...mapGetters({
      capturedPieces: "capturedPieces"
    })
  }
};
</script>

  <style scoped>
.captureRow {
  display: flex;
}

.pen {
  width: 48px;
  height: 48px;
  position: relative;
}

.pen + .pen {
  margin-left: -16px;
}
</style>
