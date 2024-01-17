<template>
  <main>
    <div class="w-full max-w-[400px] mx-auto p-[1rem] laptop:p-0 pt-0">
      <NFTWidgetBaseCard>
        <NuxtLink :to="viewInfoLocation" target="_blank">
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
import {
  logTrackerEvent,
  logPurchaseFlowEvent,
  logPurchaseNFTBookEvent,
} from '~/util/EventLogger';
import { getNFTClassCollectionType, nftClassCollectionType } from '~/util/nft';
import { getNFTBookPaymentStatusEndpoint } from '~/util/api';
import nftOrCollectionMixin from '~/mixins/nft-or-collection';

export default {
  name: 'NFTGiftSuccessPage',
  mixins: [nftOrCollectionMixin],
  async asyncData({ query, store, error, i18n }) {
    const { class_id: classId, collection_id: collectionId } = query;
    if (!classId && !collectionId) {
      error({ statusCode: 400, message: i18n.t('nft_gift_missing_qs') });
      return;
    }
    try {
      if (collectionId) {
        await store.dispatch('lazyFetchNFTCollectionInfoByCollectionId', {
          collectionId,
        });
      } else if (classId) {
        await store.dispatch('lazyGetNFTClassMetadata', classId);
        const classCollectionType = getNFTClassCollectionType(
          store.getters.getNFTClassMetadataById(classId)
        );
        if (classCollectionType === nftClassCollectionType.NFTBook) {
          await store.dispatch('fetchNFTBookInfoByClassId', classId);
        }
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
    collectionId() {
      return this.$route.query.collection_id;
    },
    paymentId() {
      return this.$route.query.payment_id;
    },
  },
  async mounted() {
    const { redirect, from, ...query } = this.$route.query;
    let price;
    try {
      const { data } = await this.$api.get(
        getNFTBookPaymentStatusEndpoint({
          classId: this.classId,
          collectionId: this.collectionId,
          paymentId: this.paymentId,
        })
      );
      ({ price } = data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    if (redirect && query.type === 'nft_book') {
      logPurchaseFlowEvent(this, 'purchase', {
        items: [
          {
            name: this.NFTName,
            classId: this.classId,
            collectionId: this.collectionId,
            price,
          },
        ],
        price,
        currency: 'USD',
        isNFTBook: true,
      });
      logPurchaseNFTBookEvent(this, {
        name: this.NFTName,
        currency: 'USD',
        classId: this.classId,
        collectionId: this.collectionId,
        price,
      });
      logTrackerEvent(
        this,
        'NFT',
        'nft_gift_purchase_success',
        this.primaryKey,
        1
      );
      this.$router.replace({
        ...this.$route,
        query,
      });
    }
  },
  methods: {
    handleClickViewDetails() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_gift_view_details_clicked',
        this.primaryKey,
        1
      );
    },
    handleClickViewClass() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_gift_view_class_button_clicked',
        this.primaryKey,
        1
      );
      this.$router.push(this.viewInfoLocation);
    },
  },
};
</script>
