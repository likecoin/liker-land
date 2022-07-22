<template lang="pug">
  section
    .max-w-phone.mx-auto.px-24.text-center
      h1.text-30.text-like-green.font-500
        | {{ $t('CLP.suggestedCreators.title') }}
      p.mt-24.leading-1_5 {{ $t('CLP.suggestedCreators.description') }}

    .mt-40.mx-40(class="phone:mx-16")
      SuperLikeContentGrid.justify-center(
        preset="creator"
        :contents="gridContents"
        :is-loading="gridContents.length === 0"
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
import Button from '../../LegacyButton/Button';
import PureSupportingClassicView from '../../SupportingLikerView/PureSupportingClassicView';
import SuperLikeContentGrid from '../../SuperLikeContentGrid';

export default {
  components: {
    Button,
    PureSupportingClassicView,
    SuperLikeContentGrid,
  },
  props: {
    contents: {
      type: Array,
      default: () => [],
    },
    isShowClassic: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    gridContents() {
      if (this.isShowClassic) return this.contents.slice(0, 5);
      return this.contents;
    },
  },
};
</script>
