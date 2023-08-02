<template>
  <Page class="px-[8px]">
    <div :class="[
      'flex',

      'flex-col',
      'desktop:flex-row',
      'gap-x-[24px]',
      'gap-y-[48px]',

      'items-center',
      'desktop:items-start',
      'desktop:justify-center',

      'w-full',
      'pt-[32px]',
      'pb-[120px]'
    ]">
      <div>
        You have successfully subscribed to {{ wallet }}!
        <NuxtLink :to="localeLocation({
          name: 'id',
          params: { id: getAddress }
        })">
          Go back to creator's page
        </NuxtLink>
      </div>
    </div>
  </Page>
</template>

<script>
import walletMixin from '~/mixins/wallet';

export default {
  name: 'NFTCreatorReadershipPage',
  mixins: [walletMixin],
  layout: 'default',
  computed: {
    wallet() {
      return this.$route.params.id;
    },
  },
};
</script>
