<template>
  <span
    class="border-black card-brand border-1 rounded-4"
  >
    <AmexIcon v-if="brand === 'amex'" />
    <MasterCardIcon v-else-if="brand === 'mastercard'" />
    <VisaIcon v-else-if="brand === 'visa'" />
  </span>
</template>

<script>
import AmexIcon from './logos/amex.svg?inline';
import VisaIcon from './logos/visa.svg?inline';
import MasterCardIcon from './logos/mastercard.svg?inline';

export default {
  name: 'CardBrand',
  components: {
    AmexIcon,
    VisaIcon,
    MasterCardIcon,
  },
  props: {
    brand: {
      type: String,
      default: 'visa',
    },
  },
};
</script>

<style lang="scss">
.card-brand {
  height: 1em;
  line-height: 1;
  padding: 0 0.1em;

  svg {
    display: block;
    height: 100%;
  }
}
</style>
