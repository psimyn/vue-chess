<template>
  <span
    class="square"
    :data-coord="`${file}${rank}`"
    :style="{
      backgroundColor
    }"
    v-on:mousedown.prevent="handlePointerDown"
    v-on:touchstart.prevent="handlePointerDown"
  >
    <div
      v-if="showLabel"
      class="square-label"
    >
      {{ rank }}{{ file }}
    </div>
    <piece
      v-show="piece"
      v-bind:piece="piece"
      :selected="isSelected"
      :transform="transform"
    />
  </span>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { isEqual } from "lodash";
import Piece from "./Piece.vue";

const bg = {
  selected: "#55bbee",
  previousSrc: "#ffedab",
  previousDest: "#ffed4b"
};

function coords(evt) {
  let clientX = evt.clientX;
  let clientY = evt.clientY;

  const touchPoint =
    (evt.touches && evt.touches[0]) ||
    (evt.changedTouches && evt.changedTouches[0]);
  if (touchPoint) {
    clientX = touchPoint.clientX;
    clientY = touchPoint.clientY;
  }

  return {
    clientX,
    clientY
  };
}

export default {
  components: {
    Piece
  },
  props: {
    piece: {
      type: Object
    },
    rank: {
      type: Number
    },
    file: {
      type: String
    },
    showLabel: {
      type: Boolean,
      default: process.env.NODE_ENV !== "production"
    }
  },
  data() {
    return {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0
    };
  },
  computed: {
    ...mapGetters({
      previousMove: "previousMove",
      selected: "selected"
    }),
    transform() {
      return {
        x: this.x,
        y: this.y
      };
    },
    isSelected() {
      return this.selected === `${this.file}${this.rank}`;
    },
    previousSrc() {
      return this.matches(this.previousMove.src);
    },
    previousDest() {
      return this.matches(this.previousMove.dest);
    },
    backgroundColor() {
      if (this.isSelected) {
        return bg.selected;
      }
      if (this.previousSrc) {
        return bg.previousSrc;
      }
      if (this.previousDest) {
        return bg.previousDest;
      }
    }
  },
  methods: {
    ...mapActions(["clickSquare", "selectSquare"]),
    matches(square = {}) {
      const { file, rank } = square;
      return this.file === file && this.rank === rank;
    },
    handlePointerDown(evt) {
      const square = evt.currentTarget.getAttribute("data-coord");

      this.selectSquare(square);

      this.addEventListeners();

      const { clientX, clientY } = coords(evt);
      this.x = 0;
      this.y = 0;
      this.startX = clientX;
      this.startY = clientY;
    },
    handlePointerMove(evt) {
      if (this.isUpdating) return;

      const { clientX, clientY } = coords(evt);

      this.isUpdating = true;
      requestAnimationFrame(() => {
        this.x = clientX - this.startX;
        this.y = clientY - this.startY;
        this.isUpdating = false;
      });
    },
    handlePointerUp(evt) {
      const { clientX, clientY } = coords(evt);

      const el = document.elementFromPoint(clientX, clientY);
      const square = el && el.closest(".square").getAttribute("data-coord");

      this.x = 0;
      this.y = 0;

      this.clickSquare(square);
      this.removeEventListeners();
    },
    addEventListeners() {
      window.addEventListener("mousemove", this.handlePointerMove);
      window.addEventListener("touchmove", this.handlePointerMove);
      window.addEventListener("mouseup", this.handlePointerUp);
      window.addEventListener("touchend", this.handlePointerUp);
      window.addEventListener("touchcancel", this.handlePointerUp);
    },
    removeEventListeners() {
      window.removeEventListener("mousemove", this.handlePointerMove);
      window.removeEventListener("touchmove", this.handlePointerMove);
      window.removeEventListener("mouseup", this.handlePointerUp);
      window.removeEventListener("touchend", this.handlePointerUp);
      window.removeEventListener("touchcancel", this.handlePointerUp);
    }
  }
};
</script>

<style>
.square {
  cursor: pointer;
  text-align: center;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
}

.square:hover {
  background: #88ccff !important;
}

.square:nth-child(-2n + 8),
.square:nth-child(8) ~ .square:nth-child(-2n + 15),
.square:nth-child(16) ~ .square:nth-child(-2n + 24),
.square:nth-child(24) ~ .square:nth-child(-2n + 31),
.square:nth-child(32) ~ .square:nth-child(-2n + 40),
.square:nth-child(40) ~ .square:nth-child(-2n + 47),
.square:nth-child(48) ~ .square:nth-child(-2n + 56),
.square:nth-child(56) ~ .square:nth-child(-2n + 63) {
  background: #aaa;
}

.square-label {
  position: absolute;
  opacity: 0.6;
  user-select: none;
  align-self: flex-start;
}
</style>
