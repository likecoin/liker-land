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
      )
</template>

<script>
import SuperLikeContentGrid from '../../SuperLikeContentGrid';

export default {
  components: {
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
