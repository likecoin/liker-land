<template lang="pug">
  ClientOnly(v-if="isLoading || contents.length > 0")
    Stack(
      ref="stack"
      :column-min-width="288"
      :column-max-width="300"
      :gutter-width="16"
      :gutter-height="24"
    )
      template(v-if="isLoading")
        StackItem(v-for="i in 3" :key="`${i}`")
          Card
            Placeholder.h-16(:class="`w-${i % 3 + 2}/5`")
            Placeholder.h-16.mt-12.w-full
            Placeholder.h-16.mt-8.w-full(v-if="i % 2")
            Placeholder.h-16.mt-8.w-full(v-if="i % 3")
            Placeholder.h-16.mt-8(:class="`w-${i % 3 + 1}/5`")
      template(v-else)
        StackItem(v-for="(item, i) in contents" :key="item.superLikeID")
          SuperLikeContentCard(
            :preset="preset"
            :referrer="item.referrer"
            :author-id="item.user"
            :super-like-id="item.superLikeID"
            :super-like-short-id="item.superLikeShortID"
            :timestamp="item.ts"
            @fetched="updateLayout"
            @image-loaded="updateLayout"
          )
        StackItem(v-if="$slots.append")
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
  },
  methods: {
    updateLayout() {
      if (this.$refs.stack) {
        this.$refs.stack.reflow();
      }
    },
  },
};
</script>
