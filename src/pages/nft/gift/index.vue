<template>
  <main>
    <div class="w-full max-w-[400px] mx-auto p-[1rem] laptop:p-0 pt-0">
      <NFTWidgetBaseCard>
        <NuxtLink
          :to="
            localeLocation({ name: 'nft-class-classId', params: { classId } })
          "
          target="_blank"
        >
          <NFTWidgetContentPreview
            :class="[
              'transition-shadow',
              'cursor-pointer',
              'min-h-[300px]',
              'w-full',
            ]"
            :title="NFTName"
            :description="NFTDescription"
            :img-src="NFTImageUrl"
            @click="handleClickViewDetails"
          />
        </NuxtLink>
      </NFTWidgetBaseCard>
    </div>

    <MobileStickyCard
      class="flex flex-col justify-center items-center w-full laptop:max-w-[400px] mx-auto py-[1.5rem]"
    >
      <IconGift class="w-[32px] mb-[8px] text-dark-gray" />
      <Label
        class="text-medium-gray w-full my-[4px]"
        preset="p6"
        align="center"
        :text="$t('nft_book_gift_page_description_0')"
      />
      <Label
        class="text-medium-gray w-full my-[4px]"
        preset="p6"
        align="center"
        :text="$t('nft_book_gift_page_description_1')"
      />
      <ButtonV2
        class="my-[8px]"
        :text="$t('nft_book_gift_page_view_class_button')"
        preset="tertiary"
        @click="handleClickViewClass"
      />
    </MobileStickyCard>
  </main>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';
import { getNFTClassCollectionType, nftClassCollectionType } from '~/util/nft';

import nftMixin from '~/mixins/nft';

export default {
  name: 'NFTGiftSuccessPage',
  mixins: [nftMixin],
  async asyncData({ query, store, error, i18n }) {
    const { class_id: classId } = query;
    if (!classId) {
      error({ statusCode: 400, message: i18n.t('nft_gift_missing_qs') });
      return;
    }
    try {
      await store.dispatch('lazyGetNFTClassMetadata', classId);
      const classCollectionType = getNFTClassCollectionType(
        store.getters.getNFTClassMetadataById(classId)
      );
      if (classCollectionType === nftClassCollectionType.NFTBook) {
        await store.dispatch('fetchNFTBookInfoByClassId', classId);
      }
    } catch (err) {
      error({ statusCode: 404, message: i18n.t('nft_gift_class_not_found') });
    }
  },
  data() {
    return {
      priceIndex: this.$route.query.price_index,
    };
  },
  computed: {
    classId() {
      return this.$route.query.class_id;
    },
  },
  methods: {
    handleClickViewDetails() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_gift_view_details_clicked',
        this.classId,
        1
      );
    },
    handleClickViewClass() {
      logTrackerEvent(this, 'NFT', 'nft_gift_view_class_button_clicked', '', 1);
      this.$router.push(
        this.localeLocation({
          name: 'nft-class-classId',
          params: {
            classId: this.classId,
          },
        })
      );
    },
  },
};
</script>
