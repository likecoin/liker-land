<template>
  <span
    class="card-brand border-1 border-black rounded-4"
  >
    <AmexIcon v-if="brand === 'amex'" />
    <MasterCardIcon v-else-if="brand === 'mastercard'" />
    <VisaIcon v-else-if="brand === 'visa'" />
  </span>
</template>

<script>
export default {
  name: 'CardBrand',
  components: {
    AmexIcon: () =>
      import(/* webpackChunkName: "svg-app" */ './logos/amex.svg'),
    VisaIcon: () =>
      import(/* webpackChunkName: "svg-app" */ './logos/visa.svg'),
    MasterCardIcon: () =>
      import(/* webpackChunkName: "svg-app" */ './logos/mastercard.svg'),
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
  padding: 0.08em;

  svg {
    display: block;
    height: 100%;
  }
}
</style>
