<template>
  <div class="flex gap-[8px]">
    <div
      v-for="(type, index) in contentTypes"
      :key="type"
      class="flex gap-[8px] items-center"
    >
      <ButtonV2
        size="mini"
        preset="tertiary"
        content-class="px-[16px]"
        :text="getContentType(type)"
      />
      <IconAdd v-if="index !== contentTypes.length - 1" class="text-medium-gray" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    contentTypes: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getContentType(type) {
      switch (type) {
        case 'epub':
          return this.$t('nft_details_page_button_type_epub');
        case 'pdf':
          return this.$t('nft_details_page_button_type_pdf');
        case 'nft':
          return this.$t('nft_details_page_button_type_nft');
        default:
          return this.$t('nft_details_page_button_type_other');
      }
    },
  },
};
</script>
