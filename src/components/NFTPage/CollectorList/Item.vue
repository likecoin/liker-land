<template>
  <tr
    class="border-b-shade-gray border-b-[1px] text-dark-gray cursor-pointer hover:bg-light-gray transition-colors"
    @click="handleRowClick"
  >
    <td class="py-[12px] max-w-[200px] px-[8px]">
      <LinkV2
        class="flex items-center gap-[8px]"
        :to="
          owner.id
            ? localeLocation({
                name: 'id',
                params: { id: owner.id },
              })
            : ''
        "
        @click.native.stop
      >
        <Identity
          class="shrink-0"
          :avatar-url="owner.avatar"
          :avatar-size="24"
          :is-avatar-outlined="owner.isCivicLiker"
          :is-lazy-loaded="true"
        />
        <span class="truncate">{{ owner.displayName }}</span>
      </LinkV2>
    </td>
    <td v-if="hasMemo" class="py-[12px] px-[8px]">
      <span class="truncate text-[12px] text-medium-gray font-500">{{
        owner.memo
      }}</span>
    </td>
    <td class="py-[12px] px-[8px]">
      <Label preset="p6">{{ owner.collectedCount }}</Label>
    </td>
  </tr>
</template>

<script>
import { ellipsis } from '~/util/ui';

export default {
  name: 'NFTPageCollectorListItem',
  filters: {
    ellipsis,
  },
  props: {
    classId: {
      type: String,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
    hasMemo: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    handleRowClick() {
      this.$router.push(
        this.localeLocation({
          name: 'nft-class-classId-nftId',
          params: {
            classId: this.classId,
            nftId: this.owner.collectedFirstNFTId,
          },
        })
      );
    },
  },
};
</script>
