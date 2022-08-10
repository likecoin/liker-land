<template>
  <div>
    <div v-for="owner in ownerList" :key="owner.displayName">
      <div class="flex items-center justify-between">
        <LinkV2 :to="`/${owner.id}`">{{ owner.displayName | ellipsis }}</LinkV2>
        <Label preset="p6">{{ owner.collectedCount }}</Label>
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
</template>

<script>
import { ellipsis } from '~/util/ui';

export default {
  name: 'CollectorListItems',
  filters: {
    ellipsis,
  },
  props: {
    ownerList: {
      type: Array,
      default: undefined,
    },
  },
};
</script>
