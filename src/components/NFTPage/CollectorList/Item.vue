<template>
  <li
    class="border-shade-gray border-[0] border-b-[1px] py-[12px] cursor-pointer hover:bg-light-gray transition-colors px-[8px]"
    @click="handleRowClick"
  >
    <div class="flex items-center justify-between">
      <LinkV2
        class="flex items-center gap-[8px]"
        :to="localeLocation({
          name: 'id',
          params: { id: owner.id }
        })"
        @click.native.stop
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
  </li>
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
