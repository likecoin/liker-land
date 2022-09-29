<template>
  <div :class="wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MagicGrid',

  props: {
    wrapper: {
      type: String,
      default: 'wrapper',
    },
    gap: {
      type: Number,
      default: 16,
    },
    maxCols: {
      type: Number,
      default: 2,
    },
    maxColWidth: {
      type: Number,
      default: 310,
    },
    animate: {
      type: Boolean, // Animate item positioning.
      default: false,
    },
  },

  data() {
    return {
      started: false,
      items: [],
    };
  },

  updated() {
    // Make sure $el is ready if only updated once.
    this.$nextTick(() => this.waitUntilReady());
  },

  methods: {
    waitUntilReady() {
      if (this.isReady()) {
        this.positionItems();

        window.addEventListener('resize', () => {
          setTimeout(this.positionItems(), 200);
        });
      } else this.getReady();
    },

    isReady() {
      return this.$el && this.items.length > 0;
    },

    getReady() {
      this.items = this.$el.children;

      if (this.isReady()) {
        this.init();
      }
    },

    init() {
      if (!this.isReady() || this.started) return;

      this.$el.style.position = 'relative';

      Array.prototype.forEach.call(this.items, item => {
        // eslint-disable-next-line no-param-reassign
        item.style.position = 'absolute';
        // eslint-disable-next-line no-param-reassign
        item.style.maxWidth = `${this.maxColWidth}px`;
        // eslint-disable-next-line no-param-reassign
        if (this.animate) item.style.transition = 'top, left 0.2s ease';
      });

      this.started = true;
      this.waitUntilReady();
    },

    colWidth() {
      return this.items[0].getBoundingClientRect().width + this.gap;
    },

    setup() {
      const { width } = this.$el.getBoundingClientRect();
      let numCols = Math.floor(width / this.colWidth()) || 1;
      const cols = [];

      if (this.maxCols && numCols > this.maxCols) {
        numCols = this.maxCols;
      }

      for (let i = 0; i < numCols; i += 1) {
        cols[i] = {
          height: 0,
          top: 0,
          index: i,
        };
      }

      const wSpace = width - numCols * this.colWidth() + this.gap;

      return {
        cols,
        wSpace,
      };
    },

    nextCol(cols, i) {
      return cols[i % cols.length];
    },

    positionItems() {
      let { wSpace } = this.setup();
      const { cols } = this.setup();

      wSpace = Math.floor(wSpace / 2);

      Array.prototype.forEach.call(this.items, (item, i) => {
        const min = this.nextCol(cols, i);
        const left = min.index * this.colWidth() + wSpace;

        // eslint-disable-next-line no-param-reassign
        item.style.left = `${left}px`;
        // eslint-disable-next-line no-param-reassign
        item.style.top = `${min.height + min.top}px`;

        min.height += min.top + item.getBoundingClientRect().height;
        min.top = this.gap;
      });

      this.$el.style.height = `${this.getMax(cols).height}px`;
    },

    getMax(cols) {
      let max = cols[0];

      cols.forEach(col => {
        if (col.height > max.height) max = col;
      });

      return max;
    },

    getMin(cols) {
      let min = cols[0];

      cols.forEach(col => {
        if (col.height < min.height) min = col;
      });

      return min;
    },
  },
};
</script>
