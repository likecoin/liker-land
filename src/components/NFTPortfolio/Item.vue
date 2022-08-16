<template>
  <NuxtLink
    class="mx-auto mb-[5px] break-inside-avoid"
    :to="{ name: 'nft-class-classId', params: { classId } }"
    target="_blank"
    @click="handleClickViewDetails"
  >
    <NFTPortfolioCard>
      <div
        class="h-[180px]"
        :style="`background-color: ${NFTImageBackgroundColor}`"
      >
        <img
          class="object-cover w-full max-h-[180px]"
          :src="NFTImageUrl"
        >
      </div>
      <div
        :class="[
          'flex',
          'flex-col',
          'text-center',
          'whitespace-pre-line',
          'px-[24px]',
          'pt-[48px]',
          'py-[24px]',
          'relative',
        ]"
      >
        <div class="flex flex-col items-center justify-center mt-[-70px]">
          <Identity
            :avatar-url="avatarList[iscnOwner]"
            :avatar-size="40"
            :is-avatar-outlined="civicLikerList[iscnOwner]"
          />
          <div class="flex mt-[8px]">
            <Label class="text-medium-gray">by</Label>
            <Label
              class="text-like-green ml-[4px] font-[600]"
            >{{ displayNameList[iscnOwner] | ellipsis }}</Label>
          </div>
        </div>
        <Label preset="h5" class="mt-[12px] break-all" align="center">
          {{ NFTName }}
        </Label>
        <div class="z-[500] flex justify-center">
          <ButtonV2
            preset="secondary"
            class="my-[16px]"
            @click.stop.prevent="handleClickCollect"
          >
            <span>{{ NFTPrice || '-' }} $LIKE</span>
            <template #prepend>
              <IconPrice />
            </template>
          </ButtonV2>
        </div>
        <div class="flex items-center justify-center">
          <div class="flex items-center text-medium-gray mr-[18px]">
            <IconMint />
            <div class="ml-[4px]">{{ mintedCount }}</div>
          </div>
          <div class="flex items-center text-medium-gray">
            <IconOwner />
            <div class="ml-[4px]">{{ ownerCount }}</div>
          </div>
        </div>
      </div>
    </NFTPortfolioCard>
  </NuxtLink>
</template>

<script>
import nftMixin from '~/mixins/nft';

import { logTrackerEvent } from '~/util/EventLogger';
import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  mixins: [nftMixin],
  props: {
    classId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.updateNFTClassMetdata();
    this.updateNFTPurchaseInfo();
    this.updateNFTOwners();
  },
  methods: {
    handleClickCollect() {
      logTrackerEvent(this, 'NFT', 'NFTCollect(Portfolio)', this.classId, 1);
      this.collectNFT();
    },
    handleClickViewDetails() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTViewDetails(Portfolio)',
        this.classId,
        1
      );
    },
  },
};
</script>
