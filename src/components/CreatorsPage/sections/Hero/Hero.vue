<template lang="pug">
  section.bg-white.px-16(
    class="laptop:flex laptop:pr-0 desktop:mx-16 desktop:rounded-12"
  )
    .flex-no-shrink.flex.items-center.px-16.py-32(class="laptop:p-48 laptop:pr-16")
      .text-center.mx-auto(class="laptop:text-left laptop:max-w-phone-min")
        h1.text-32.text-like-green.font-500
          | {{ $t('CreatorsPageV2.Hero.Title') }}
        p.mt-20 {{ $t('CreatorsPageV2.Hero.Description') }}
        Button.mt-48.mx-auto.max-w-phone-min(
          :title="$t('CreatorsPageV2.Hero.CTAButton')"
          :to="{ name: 'creators-setup' }"
          :full="true"
          size="large"
        )
    .flex-grow.flex.justify-end.flex-col
      img.block.mt-24.mx-auto.object-bottom.object-contain(
        class="phone:max-w-full tablet:max-w-phone laptop:-mr-32"
        src="./assets/feature.png"
      )
</template>

<script>
import Button from '~/components/Button/Button';

export default {
  components: {
    Button,
  },
};
</script>
