<template>
  <ul>
    <li v-for="owner in ownerList" :key="owner.displayName">
      <div class="flex items-center justify-between">
        <LinkV2
          class="flex items-center gap-[8px]"
          :to="`/${owner.id}`"
        >
          <Identity
            :avatar-url="owner.avatar"
            :avatar-size="24"
            :is-avatar-outlined="owner.isCivicLiker"
            :is-lazy-loaded="true"
          />
          <span>{{ owner.displayName | ellipsis }}</span>
        </LinkV2>
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
    </li>
  </ul>
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
