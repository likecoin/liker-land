<template lang="pug">
  section.py-40.px-16.text-center
    h1.text-30.text-like-green.font-500
      | {{ $t('CreatorsPageV2.Platforms.Title') }}
    p.mt-12.mx-auto.max-w-phone {{ $t('CreatorsPageV2.Platforms.Description') }}
    ul.mt-32.list-disc.flex.items-center.justify-center.flex-wrap
      li.p-8(
        v-for="p in platforms"
        :key="p.id"
      )
        a.bg-white.rounded-8.block(
          class="hover:bg-gray-e6 active:gray-d8"
          :href="p.link"
          :alt="p.alt"
          target="_blank"
        )
          img.block.w-48(
            :src="p.logoSrc"
            :alt="p.alt"
          )
</template>

<script>
const getLogo = require.context('./assets/logos');

function getSetupRoute(type) {
  return {
    name: 'creators-setup',
    hash: `#${type}`,
  };
}

export default {
  computed: {
    platforms() {
      return [
        {
          id: 'matters',
          type: 'config-liker-id',
          alt: 'Matters',
        },
        {
          id: 'vocus',
          type: 'config-liker-id',
          alt: 'Vocus',
        },
        {
          id: 'timelog',
          type: 'config-liker-id',
          alt: 'Timelog',
        },
        {
          id: 'wordpress',
          type: 'wordpress',
          alt: 'WordPress',
        },
        {
          id: 'inmedia',
          type: 'provide-liker-id',
          alt: 'InMedia',
        },
        {
          id: 'standnews',
          type: 'provide-liker-id',
          alt: 'Standnews',
        },
        {
          id: 'medium',
          type: 'embedly',
          alt: 'Medium',
        },
        {
          id: 'blogger',
          type: 'plugin',
          alt: 'Blogger',
        },
        {
          id: 'pixnet',
          type: 'plugin',
          alt: 'Pixnet',
        },
      ].map(({ id, type, alt }) => ({
        id,
        logoSrc: getLogo(`./${id}.png`),
        to: getSetupRoute(type),
        alt: this.$t(`Glossary.${alt}`),
        link: this.$t(`CreatorsPage.GuideLink.${alt}`),
      }));
    },
  },
};
</script>
