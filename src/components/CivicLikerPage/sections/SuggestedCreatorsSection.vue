<template lang="pug">
  section
    .max-w-phone.mx-auto.px-24.text-center
      h1.text-30.text-like-green.font-500
        | {{ $t('CLP.suggestedCreators.title') }}
      p.mt-24.leading-1_5 {{ $t('CLP.suggestedCreators.description') }}

    .mt-40.mx-40(class="phone:mx-16")
      ClientOnly(v-if="contents.length > 0")
        Stack.mt-48(
          ref="stack"
          :column-min-width="288"
          :column-max-width="300"
          :gutter-width="16"
          :gutter-height="24"
        )
          StackItem(v-for="(item, i) in contents" :key="item.superLikeID")
            SuperLikeContentCard(
              preset="creator"
              :referrer="item.referrer"
              :author-id="item.user"
              :super-like-id="item.superLikeID"
              :super-like-short-id="item.superLikeShortID"
              :timestamp="item.ts"
              @fetched="updateLayout"
              @image-loaded="updateLayout"
            )
</template>

<script>
import SuperLikeContentCard from '../../SuperLikeContentCard';

export default {
  components: {
    SuperLikeContentCard,
  },
  props: {
    contents: {
      type: Array,
      default: () => [],
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
