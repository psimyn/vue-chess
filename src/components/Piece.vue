<template>
  <span
    v-if="piece"
    v-bind:class="side"
    v-on:mousedown="handlePointerDown"
    v-on:touchstart="handlePointerDown"
  >
    <span
      v-html="svg"
      class="piece"
      :class="{ selected }"
      v-bind:style="{
        transform: `translate(${transform.x}px, ${transform.y}px)`
      }"
    ></span>
  </span>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

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
  props: {
    piece: {
      type: Object
    }
  },
  data() {
    return {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      selected: false
    };
  },
  computed: {
    side({ piece }) {
      return piece.side.name;
    },
    svg({ piece, side }) {
      return require(`../assets/${side}-${piece.type.toLowerCase()}.svg`);
    },
    transform() {
      return {
        x: this.x,
        y: this.y
      };
    }
  },
  methods: {
    ...mapActions(["joinTeam", "clickSquare", "selectSquare"]),
    handlePointerDown(evt) {
      const square = evt.target.getAttribute("data-coord");

      this.selectSquare(square);

      this.addEventListeners();

      this.selected = true;

      const { clientX, clientY } = coords(evt);
      this.x = this.startX = clientX;
      this.y = this.startY = clientY;
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

      this.selected = false;

      const el = document.elementFromPoint(clientX, clientY);
      const square = el.getAttribute("data-coord");

      this.clickSquare(square);
      this.removeEventListeners();
    },
    addEventListeners() {
      window.addEventListener("mouseMove", this.handlePointerMove);
      window.addEventListener("mouseUp", this.handlePointerUp);
    },
    removeEventListeners() {
      window.removeEventListener("mouseMove", this.handlePointerMove);
      window.removeEventListener("mouseUp", this.handlePointerUp);
    }
  }
};
</script>

<style>
.piece {
  font-weight: bold;
  font-size: 16px;
  text-shadow: 0 2px 2px white;
  /* position: absolute; */
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  /* pointer-events: none;
  touch-events: none; */
  z-index: 2;
  stroke-width: 6px;
  transition: transform 0.1s;
}

.piece:active {
  position: absolute;
}

.selected {
  transition: none;
  z-index: 4;
}

svg {
  transform: scale(1) translate(0, 25%);
}

.selected svg {
  transform: scale(1.4) translate(0, 0);
}

.white {
  color: white;
  stroke: black;
}
</style>
