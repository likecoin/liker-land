<template>
  <a
    :href="$t('boox_banner_link')"
    target="_blank"
    rel="noreferrer noopener"
    v-on="$listeners"
  >
    <picture>
      <source media="(max-width: 527px)" :srcset="getSrc('mobile')" />
      <source media="(max-width: 992px)" :srcset="getSrc('tablet')" />
      <img
        :class="[
          'w-full',
          'sm:h-[250px] desktop:h-[300px]',
          'rounded-[8px]',
          'object-cover',
        ]"
        :src="getSrc('desktop')"
        :alt="$t('boox_banner_alt_text')"
      />
    </picture>
  </a>
</template>

<script>
const getBannerSrc = require.context('~/assets/images/boox', false, /\.jpg$/);

export default {
  name: 'ListingPageBooxBanner',
  methods: {
    getSrc(viewport) {
      return getBannerSrc(`./banner-${viewport}-${this.$i18n.locale}.jpg`);
    },
  },
};
</script>
