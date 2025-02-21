<template>
  <NuxtLink class="relative block w-[310px]" :to="detailsPageRoute">
    <NFTPortfolioCard
      :class="{ 'border-like-collection border-[2px]': collectionId }"
    >
      <div
        class="relative flex items-center justify-center w-full h-full rounded-t-[inherit]"
      >
        <NFTBookCoverWithFrame
          :class="['w-full', 'rounded-t-[inherit] rounded-b-[0]']"
          :src="collectionImageUrl"
          :alt="collectionName"
          :cover-resize="450"
          class-aspect-ratio="aspect-[1]"
        />
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
          'bg-white',
          'relative',
          'rounded-b-[inherit] !rounded-t-[0]',
        ]"
      >
        <div class="flex flex-col items-center justify-center mt-[-70px]">
          <Identity
            :avatar-url="ownerAvatar"
            :avatar-size="40"
            :is-lazy-loaded="true"
          />
          <Label
            class="w-full mt-[8px] text-like-green font-[600]"
            content-class="min-w-0"
            align="center"
          >
            <span class="text-medium-gray">by</span>&nbsp;
            <span class="truncate">{{ ownerDisplayName }}</span>
          </Label>
        </div>
        <Label preset="h5" class="mt-[12px] break-normal" align="center">{{
          collectionName
        }}</Label>
        <div class="flex items-center justify-center mt-[16px]">
          <ButtonV2
            preset="secondary"
            :text="collectionAvailablePriceLabel"
            :is-disabled="!stock"
            @click="handleClickCollect"
          >
            <template #prepend>
              <NFTWidgetIconInsertCoin class="w-[16px]" />
            </template>
          </ButtonV2>
        </div>
      </div>
    </NFTPortfolioCard>
  </NuxtLink>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { parseNFTMetadataURL } from '~/util/nft';
import collectionMixin from '~/mixins/nft-collection';

export default {
  name: 'NFTBookCollectionItemCard',
  mixins: [collectionMixin],
  props: {
    collectionId: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters([
      'getNFTCollectionInfoByCollectionId',
      'getUserInfoByAddress',
    ]),
    detailsPageRoute() {
      return this.localeLocation({
        name: 'nft-collection-collectionId',
        params: { collectionId: this.collectionId },
      });
    },
    stock() {
      return this.formattedCollection?.stock;
    },
    ownerDisplayName() {
      return (
        this.getUserInfoByAddress(this.collectionOwner)?.displayName ||
        this.collectionOwner
      );
    },
    ownerAvatar() {
      return this.getUserInfoByAddress(this.collectionOwner)?.avatar;
    },
  },
  async mounted() {
    try {
      await this.lazyFetchNFTCollectionInfoByCollectionId({
        collectionId: this.collectionId,
      });
      if (this.getNFTCollectionInfoByCollectionId?.collectionOwner) {
        this.lazyGetUserInfoByAddresses(
          this.getNFTCollectionInfoByCollectionId.collectionOwner
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching collection info: ${error}`);
    }
  },
  methods: {
    ...mapActions([
      'lazyFetchNFTCollectionInfoByCollectionId',
      'lazyGetUserInfoByAddresses',
    ]),
    parseNFTMetadataURL,
    handleClickCollect() {
      this.$emit('click-collect');
      this.$router.push(this.detailsPageRoute);
    },
  },
};
</script>
