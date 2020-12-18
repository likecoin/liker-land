<template lang="pug">
  .likecoin-embed.likecoin-button.pointer-events-none.user-select-none
    div
    iframe(
      scrolling="no"
      frameborder="0"
      :src="src"
    )
</template>

<script>
import { LIKECOIN_BUTTON_BASE } from '~/constant';

export default {
  props: {
    likerId: {
      type: String,
      default: '',
    },
  },
  computed: {
    src() {
      return `${LIKECOIN_BUTTON_BASE}/in/embed/${
        this.likerId
      }/button?preview=1`;
    },
  },
};
</script>

<style lang="scss" scoped>
$likecoin-button-max-width: 485px;
$likecoin-button-max-height: 240px;

.likecoin-button {
  position: relative;
  width: 100%;
  max-width: $likecoin-button-max-width;
  max-height: $likecoin-button-max-height;
  margin: 0 auto;

  > div {
    padding-top: $likecoin-button-max-height / $likecoin-button-max-width * 100%;
  }

  > iframe {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
  }
}
</style>
