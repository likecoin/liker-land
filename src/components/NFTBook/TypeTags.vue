<template>
  <ul class="flex gap-[4px] sm:gap-[8px]">
    <li
      v-for="(type, index) in contentTypes"
      :key="type"
      class="flex gap-[4px] sm:gap-[8px] items-center"
    >
      <div class="py-[6px] px-[12px] sm:px-[24px] bg-shade-gray rounded-[16px] text-10">
        {{ getContentType(type) }}
      </div>
      <IconAdd v-if="index !== contentTypes.length - 1" class="text-medium-gray" />
    </li>
  </ul>
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
