<template>
  <CardV2 class="!px-[32px]">
    <header>
      <Label
        class="text-like-green font-600"
        :text="$t('nft_class_details_info_section_title')"
        tag="div"
        preset="h5"
        valign="middle"
      >
        <template #prepend>
          <CoinInsertIcon />
        </template>
      </Label>
    </header>

    <div class="mt-[40px]">
      <Label
        class="mb-[4px] text-medium-gray"
        preset="h6"
        :text="$t('nft_class_details_info_section_nft_class_id_label')"
      />
      <Label
        preset="p6"
        :text="classId"
        :is-truncated="true"
      />

      <div class="flex gap-[16px] items-center mt-[24px] text-[12px] text-medium-gray">
        <div class="flex items-center">
          <IconMint />
          <div class="ml-[4px]">{{ collectedCount }}</div>
        </div>
        <div class="flex items-center">
          <IconOwner />
          <div class="ml-[4px]">{{ collectorCount }}</div>
        </div>
      </div>
    </div>
  </CardV2>
</template>

<script>
import CoinInsertIcon from '~/assets/icons/coin-insert.svg?inline';

export default {
  name: 'NFTPageClassInfoSection',
  components: {
    CoinInsertIcon,
  },
  props: {
    classId: {
      type: String,
      default: '',
    },
    collectedCount: {
      type: Number,
      default: 0,
    },
    collectorCount: {
      type: Number,
      default: 0,
    },
  },
};
</script>
