<template>
  <DropDownList
    :class="[
      'w-full',
      rootClass
    ]"
    :title="$t('nft_details_page_title_collector')"
  >
    <template #titleIcon>
      <slot name="titleIcon" />
    </template>
    <template #content>
      <div class="flex flex-col my-[12px]">
        <div v-if="ownerCount">
          <div v-for="o in ownerList" :key="o">
            <div class="flex items-center justify-between">
              <LinkV2 :to="`/${o}`">{{ displayNameList[o] || o | ellipsis }}</LinkV2>
              <Label preset="p6">{{ collectorList[o].length }}</Label>
            </div>
            <div
              :class="[
                'bg-shade-gray',
                'h-[1px]',
                'w-full',
                'my-[12px]',
              ]"
            />
          </div>
        </div>
        <div v-else>
          <div class="flex justify-center">
            <Label preset="p6" :text="$t('nft_details_page_label_no_record')" />
          </div>
        </div>
      </div>
    </template>
  </DropDownList>
</template>
<script>
import { ellipsis } from '~/util/ui';

export default {
  name: 'CollectorList',
  filters: {
    ellipsis,
  },
  props: {
    // rootClass
    rootClass: {
      type: String,
      default: undefined,
    },

    // content
    ownerCount: {
      type: Number,
      default: undefined,
    },
    ownerList: {
      type: Array,
      default: undefined,
    },
    displayNameList: {
      type: Array,
      default: undefined,
    },
    collectorList: {
      type: Object,
      default: undefined,
    },
  },
};
</script>
