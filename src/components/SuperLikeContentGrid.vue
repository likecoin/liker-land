<template lang="pug">
  .grid(ref="grid")
    .grid-col(
      v-for="i in columnCount"
      :key="`${i}`"
      :style="`max-width: ${maxItemWidth}px`"
    )
      PortalTarget(
        v-for="j in rowCount"
        :key="`${j}`"
        :name="`grid-item-${(j - 1) * columnCount + i}`"
      )

    template(v-if="isLoading")
      Portal(
        v-for="i in columnCount"
        :key="`portal-grid-item-${i}`"
        :to="`grid-item-${i}`"
      )
        Card
          Placeholder.h-16(:class="`w-${i % 3 + 2}/5`")
          Placeholder.h-16.mt-12.w-full
          Placeholder.h-16.mt-8.w-full(v-if="i % 2")
          Placeholder.h-16.mt-8.w-full(v-if="i % 3")
          Placeholder.h-16.mt-8(:class="`w-${i % 3 + 1}/5`")
    template(v-else)
      Portal(
        v-for="(item, i) in contents"
        :key="`grid-item-${i + 1}`"
        :to="`grid-item-${i + 1}`"
      )
        SuperLikeContentCard(
          :key="item.superLikeID"
          :preset="preset"
          :referrer="item.referrer"
          :author-id="item.user"
          :super-like-id="item.superLikeID"
          :super-like-short-id="item.superLikeShortID"
          :timestamp="item.ts"
        )
      Portal(
        v-if="$slots.append"
        :to="`grid-item-${contents.length + 1}`"
      )
        slot(name="append")
</template>

<script>
import Card from './Card/PureCard';
import Placeholder from './Placeholder/Placeholder';
import SuperLikeContentCard from './SuperLikeContentCard';

export default {
  components: {
    Card,
    Placeholder,
    SuperLikeContentCard,
  },
  props: {
    preset: {
      type: String,
      default: 'default',
    },
    contents: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    minItemWidth: {
      type: Number,
      default: 288,
    },
    maxItemWidth: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      columnCount: 1,
    };
  },
  computed: {
    itemCount() {
      let count = this.contents.length;
      if (this.$slots.append) count += 1;
      return count;
    },
    rowCount() {
      return Math.ceil(this.itemCount / this.columnCount);
    },
  },
  mounted() {
    window.addEventListener('resize', this.updateColumnCount);
    this.updateColumnCount();
  },
  destroyed() {
    window.removeEventListener('resize', this.updateColumnCount);
  },
  methods: {
    updateColumnCount() {
      if (!this.$refs.grid) return;
      const { offsetWidth: gridWidth } = this.$refs.grid;
      const columnCount = Math.floor(
        Math.max(gridWidth / this.minItemWidth, gridWidth / this.maxItemWidth)
      );
      if (columnCount !== this.columnCount) {
        this.columnCount = columnCount;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.grid {
  display: flex;

  &-col {
    flex: 1;

    &:not(:first-child) {
      margin-left: 16px;
    }

    > *:not(:first-child) {
      margin-top: 24px;
    }
  }
}
</style>
