<template>
  <main>
    <div class="flex justify-center item-start gap-[45px] w-full mb-[60px]">
      <NFTWidgetBaseCard class="w-full max-w-[426px]">
        <NuxtLink :to="viewInfoLocation" target="_blank">
          <div class="flex flex-col gap-[16px] mb-[24px]">
            <NFTBookCoverWithFrame :src="NFTImageUrl" />
            <Label class="text-[28px] font-600" :text="NFTName" />
            <div class="grid grid-cols-2">
              <div class="flex flex-col">
                <Label
                  preset="h6"
                  :text="$t('nft_claim_NFT_author')"
                  class=" text-medium-gray"
                />
                <Label preset="h5" :text="iscnWorkAuthor" />
              </div>
              <div class="flex flex-col">
                <Label
                  preset="h6"
                  :text="$t('nft_claim_NFT_author')"
                  class=" text-medium-gray"
                />
                <Label preset="h5" :text="creatorDisplayName" />
              </div>
            </div>
            <p class="w-full line-clamp-3">{{ NFTDescription }}</p>
          </div>
        </NuxtLink>
      </NFTWidgetBaseCard>
      <NFTClaimMainSection
        :header-text="$t('nft_claim_welcome_title_send_gift')"
        :content-text="$t('nft_claim_welcome_text_send_gift')"
      >
        <template #header-prepend>
          <IconGift class="w-[48px]" />
        </template>
        <template #header-append>
          <Label
            class="text-like-green"
            preset="h5"
            :text="$t('nft_claim_NFT_name', { name: NFTName })"
          />
        </template>
        <template #footer>
          <ButtonV2
            class="px-[32px]"
            preset="tertiary"
            :text="$t('nft_book_gift_page_view_class_button')"
            @click="handleClickViewClass"
          />
        </template>
      </NFTClaimMainSection>
    </div>
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
import nftMixin from '~/mixins/nft';

export default {
  name: 'NFTGiftSuccessPage',
  mixins: [nftOrCollectionMixin, nftMixin],
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
          await store.dispatch('lazyFetchNFTBookInfoByClassId', classId);
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
