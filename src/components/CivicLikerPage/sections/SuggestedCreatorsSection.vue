<template lang="pug">
  section
    .max-w-phone.mx-auto.px-24.text-center
      h1.text-30.text-like-green.font-500
        | {{ $t('CLP.suggestedCreators.title') }}
      p.mt-24.leading-1_5 {{ $t('CLP.suggestedCreators.description') }}

    .mt-40.mx-40(class="phone:mx-16")
      SuperLikeContentGrid(
        preset="creator"
        :contents="contents"
        :is-waterfall-layout="false"
      )

      Button.block.mt-16.mx-auto.p-0.max-w-phone-min.border-2.border-like-cyan.border-solid.font-600.rounded-14(
        preset="translucent-light"
        :title="$t('SlidingMenu.creator')"
        :to="{ name: 'creators' }"
        size="large"
        :full="true"
      )
</template>

<script>
import Button from '../../Button/Button';
import SuperLikeContentGrid from '../../SuperLikeContentGrid';

export default {
  components: {
    Button,
    SuperLikeContentGrid,
  },
  props: {
    contents: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
