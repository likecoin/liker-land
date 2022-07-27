<template>
  <NFTWidgetBaseCard class="flex items-center justify-between px-[24px]">
    <button class="flex items-center transition-colors text-medium-gray hover:text-dark-gray" @click="handleClickLike">
      <NFTWidgetIconLike class="w-[20px] h-[20px]" />
      <span class="ml-[12px]">like</span>
    </button>
    <div class="flex items-center text-dark-gray ml-[8px]">
      <img
        v-if="creatorAvatarSrc"
        class="w-[42px] h-[42px] rounded-full mr-[12px]"
        :src="creatorAvatarSrc"
      >
      <span>{{ formattedCreatorDisplayName }}</span>
    </div>
  </NFTWidgetBaseCard>
</template>

<script>
import { ellipsis } from '~/util/ui';

export default {
  props: {
    iscnId: {
      type: String,
      default: '',
    },
    creatorAvatarSrc: {
      type: String,
      default: '',
    },
    creatorAddress: {
      type: String,
      default: '',
    },
  },
  computed: {
    formattedCreatorDisplayName() {
      return ellipsis(this.creatorAddress);
    },
  },
  methods: {
    handleClickLike() {
      this.$emit('like');
    },
  },
};
</script>
