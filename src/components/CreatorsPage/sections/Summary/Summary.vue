<template lang="pug">
  section.py-40.px-16.text-center
    h1.text-30.text-like-green.font-500
      | {{ $t('CreatorsPageV2.Summary.Title') }}
    p.mt-12.mx-auto.max-w-phone {{ $t('CreatorsPageV2.Summary.Description') }}
    Button.mt-48.max-auto.max-w-phone-min(
      :title="$t('CreatorsPageV2.Summary.CTAButton')"
      :to="{ name: 'creators-setup' }"
      :full="true"
      size="large"
    )
</template>

<script>
import Button from '~/components/LegacyButton/Button';

export default {
  components: {
    Button,
  },
};
</script>
