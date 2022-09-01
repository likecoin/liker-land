<template>
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
      <div
        v-if="preset === 'collectible'"
        class="z-[500] flex justify-center mt-[16px]"
      >
        <ProgressIndicator v-if="uiIsOpenCollectModal && isCollecting" />
        <ButtonV2
          v-else
          preset="secondary"
          @click.stop.prevent="handleClickCollect"
        >
          <span>{{ NFTPrice || '-' }} $LIKE</span>
          <template #prepend>
            <IconPrice />
          </template>
        </ButtonV2>
      </div>
      <div class="flex items-center justify-center mt-[16px]">
        <div class="flex items-center text-medium-gray mr-[18px]">
          <IconMint />
          <div class="ml-[4px]">{{ mintedCount }}</div>
        </div>
        <div class="flex items-center text-medium-gray">
          <IconOwner />
          <div class="ml-[4px]">{{ ownerCount }}</div>
        </div>
        <div v-if="preset==='viewOnly'" class="flex items-center text-like-green ml-[18px]">
          <IconPriceMini />
          <div class="ml-[4px]">{{ NFTPrice }} $LIKE</div>
        </div>
      </div>
    </div>
  </NFTPortfolioCard>
</template>

<script>
import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';

import { logTrackerEvent } from '~/util/EventLogger';
import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  mixins: [nftMixin, walletMixin],
  props: {
    classId: {
      type: String,
      required: true,
    },
    // The preset of item, options: collectible and viewOnly.
    preset: {
      type: String,
      default: 'collectible',
    },
  },
  data() {
    return {
      isCollecting: false,
    };
  },
  mounted() {
    this.updateNFTClassMetadata();
    this.updateNFTPurchaseInfo();
    this.updateNFTOwners();
  },
  methods: {
    async handleClickCollect() {
      logTrackerEvent(this, 'NFT', 'NFTCollect(Portfolio)', this.classId, 1);
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected) {
          this.handleClickCollect();
        }
        return;
      }

      try {
        this.isCollecting = true;
        this.updateUserCollectedCount(this.classId, this.getAddress);
        await this.collectNFT();
      } catch (error) {
        // no need to handle error
      } finally {
        this.isCollecting = false;
      }
    },
  },
};
</script>
