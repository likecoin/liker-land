<template>
  <Page>
    <CardV2
      v-if="isLoading"
      class="absolute top-[40%]"
    >{{ $t('nft_details_page_label_loading') }}</CardV2>
    <div
      v-else
      class="px-[12px] laptop:px-[24px] pb-[120px] w-full"
    >

      <div class="flex flex-col gap-[32px] w-full max-w-[962px] mx-auto">
        <div class="flex flex-col items-center justify-between w-full tablet:flex-row laptop:flex-row gap-[24px]">
          <NFTMessageIdentity
            v-if="nftCollectorWalletAddress"
            :type="getWalletIdentityType(nftCollectorWalletAddress)"
            :wallet-address="nftCollectorWalletAddress"
            wrapper-classes="!bg-transparent"
          />
          <NFTPageControlBar
            :collected-count="ownCount"
            :collected-nft-ids="userCollectedNFTList"
            :class-id="classId"
            :current-nft-id="nftId"
            view="collected"
            :price="NFTPrice"
            :is-writing-nft="isWritingNFT"
            @transfer="onToggleTransfer"
            @collect="handleCollectFromControlBar"
            @click-user-collected-count="handleClickUserCollectedCount"
          />
        </div>
        <section class="flex flex-col desktop:grid grid-cols-3 gap-[16px]">
          <!-- Left column -->
          <div class="flex flex-col items-center col-span-1 desktop:order-2">
            <NFTGemWrapper :collected-count="collectedCount">
              <NFTPagePreviewCard
                :url="NFTsExternalUrl"
                :image-bg-color="NFTsImageBackgroundColor"
                :image-url="NFTsImageUrl"
                :avatar-url="creatorAvatar"
                :avatar-size="40"
                :is-avatar-outlined="isCreatorCivicLiker"
                :iscn-owner="iscnOwner"
                :display-name="creatorDisplayName"
                :nft-name="NFTsName"
                :nft-description="NFTsDescription"
                :nft-price="NFTPrice"
                @collect="handleCollectFromPreviewSection"
                @view-content="handleViewContent"
              />
            </NFTGemWrapper>
            <ButtonV2
              class="mt-[24px] text-medium-gray"
              content-class="text-[12px]"
              preset="plain"
              size="mini"
              :to="{ name: 'nft-class-classId', params: { classId } }"
            >
              <template #prepend>
                <IconEye class="w-[12px] h-[12px]" />
              </template>
              {{ $t('nft_details_page_button_view_details') }}
            </ButtonV2>
          </div>

          <!-- Right column -->
          <div class="col-span-2 flex flex-col items-center gap-[24px]">
            <CardV2 class="flex gap-[24px] w-full">
              <div>
                <Label
                  class="text-medium-gray text-[12px]"
                  preset="h6"
                  :text="$t('nft_details_page_label_owning')"
                />
                <div class="mt-[4px] text-[600]">{{ nftCollectorCollectedCount }}</div>
              </div>
              <hr class="w-[2px] bg-shade-gray h-[48px] border-none shrink-0">
              <div class="min-w-0">
                <Label
                  class="text-medium-gray text-[12px]"
                  preset="h6"
                  :text="$t('nft_details_page_label_nft_id')"
                />
                <div class="mt-[4px] flex items-center relative gap-[8px]">
                  <select
                    v-model="selectedNFTId"
                    class="absolute opacity-0"
                    @change="onSelectNFT"
                  >
                    <option
                      v-for="id in nftCollectorCollectedNFTList"
                      :key="id"
                      :value="id"
                    >{{ id }}</option>
                  </select>
                  <div class="truncate">{{ selectedNFTId }}</div>
                  <IconArrowDown class="w-[12px] h-[12px] shrink-0" />
                </div>
              </div>
            </CardV2>
            <ul class="flex flex-col gap-[24px] w-full laptop:px-[24px]">
              <NFTMessage
                v-for="m in messageList"
                :key="`${m.txHash}-${m.event}`"
                :type="m.event"
                :tx-hash="m.txHash"
                :from-type="m.fromType"
                :from-wallet="m.fromWallet"
                :to-type="m.toType"
                :to-wallet="m.toWallet"
                :message="m.message"
                :message-type="m.messageType"
                tag="li"
              />
            </ul>
          </div>
        </section>

        <Separator class="mx-auto" />

        <section>
          <NFTPageChainDataSection
            :items="populatedEvents"
            :is-loading="isHistoryInfoLoading"
            :content-url="NFTExternalUrl"
            :iscn-id="iscnId"
            :iscn-url="iscnURL"
            :content-fingerprints="nftISCNContentFingerprints"
          />
        </section>
      </div>
    </div>

    <EventModalTransfer
      v-if="classId"
      :is-open="isOpenTransferModal"
      :is-transferring="isTransferring"
      :user-collected-count="userCollectedCount"
      :nft-id="nftId"
      @close="isOpenTransferModal = false; isTransferring = false"
      @submit="handleTransfer"
    />
  </Page>
</template>

<script>
import { mapActions } from 'vuex';

import { EXTERNAL_HOST } from '~/constant';

import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import { ellipsis } from '~/util/ui';

import nftMixin from '~/mixins/nft';
import clipboardMixin from '~/mixins/clipboard';
import navigationListenerMixin from '~/mixins/navigation-listener';

export default {
  name: 'NFTDetailsPage',
  layout: 'default',
  filters: {
    ellipsis,
  },
  mixins: [clipboardMixin, nftMixin, navigationListenerMixin],
  head() {
    const title = this.NFTName || this.$t('nft_details_page_title');
    const description =
      this.NFTDescription || this.$t('nft_details_page_description');
    const ogImage =
      this.NFTImageUrl || 'https://liker.land/images/og/writing-nft.jpg';
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: ogImage,
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
      script: this.purchaseInfo.price
        ? [
            {
              hid: 'schema',
              innerHTML: JSON.stringify([
                {
                  '@context': 'http://www.schema.org',
                  '@type': 'Product',
                  name: title,
                  image: [ogImage],
                  description,
                  brand: {
                    '@type': 'Brand',
                    name: 'Writing NFT',
                  },
                  sku: this.classId,
                  iscn: this.iscnId,
                  url: `${EXTERNAL_HOST}${this.$route.path}`,
                  offers: {
                    '@type': 'Offer',
                    price: this.NFTPriceUSD,
                    priceCurrency: 'USD',
                    availability: 'LimitedAvailability',
                  },
                },
              ]),
              type: 'application/ld+json',
              body: true,
            },
          ]
        : [],
    };
  },
  data() {
    return {
      nftsMetadata: {},
      // For <select> to change only, please use `this.nftId` instead
      selectedNFTId: this.$route.params.nftId,
      isLoading: true,

      isOpenTransferModal: false,
      isTransferring: false,
      isCollecting: false,
    };
  },
  computed: {
    classId() {
      return this.$route.params.classId;
    },
    nftId() {
      return this.$route.params.nftId;
    },
    NFTsExternalUrl() {
      return this.nftsMetadata.external_url || this.NFTExternalUrl;
    },
    NFTsImageBackgroundColor() {
      return this.nftsMetadata.background_color || this.NFTImageBackgroundColor;
    },
    NFTsImageUrl() {
      const image = this.nftsMetadata.image || this.NFTImageUrl;
      const [schema, path] = image.split('://');
      if (schema === 'ar') return `${ARWEAVE_ENDPOINT}/${path}`;
      if (schema === 'ipfs') return `${IPFS_VIEW_GATEWAY_URL}/${path}`;
      return image;
    },
    NFTsName() {
      return this.nftsMetadata.name || this.NFTName;
    },
    NFTsDescription() {
      return this.nftsMetadata.description || this.NFTDescription;
    },
    isTransferDisabled() {
      return this.isOwnerInfoLoading || !this.userCollectedCount;
    },
    messageList() {
      return [...this.populatedEvents]
        .filter(e => e.event !== 'new_class')
        .map(e => {
          if (e.event === 'purchase') {
            return {
              ...e,
              fromWallet: this.iscnOwner,
              toWallet: '',
            };
          }
          return e;
        })
        .map(m => ({
          ...m,
          messageType:
            m.fromWallet === this.iscnOwner ? 'creator' : 'collector',
          fromType: this.getWalletIdentityType(m.fromWallet),
          toType: this.getWalletIdentityType(m.toWallet),
          message: m.memo === 'like.co NFT API' ? '' : m.memo,
        }));
    },
  },
  asyncData({ query }) {
    const { action } = query;
    return { action };
  },
  async fetch({ route, store, redirect, error }) {
    const { classId } = route.params;
    const { referrer } = route.query;
    if (referrer) {
      redirect({
        name: 'nft-class-classId-share',
        params: { classId },
        query: { referrer },
      });
      return;
    }
    try {
      await Promise.all([
        store.dispatch('fetchNFTClassMetadata', classId),
        store.dispatch('lazyGetNFTPurchaseInfo', classId).catch(err => {
          if (err.response?.data !== 'NFT_CLASS_NOT_FOUND') {
            // eslint-disable-next-line no-console
            console.error(JSON.stringify(err));
          }
        }),
      ]);
    } catch (err) {
      if (err.response?.data?.code === 3) {
        error({
          statusCode: 404,
          message: 'NFT_NOT_FOUND',
        });
      } else {
        // eslint-disable-next-line no-console
        console.error(JSON.stringify(err));
        error({
          statusCode: 500,
          message: 'NFT_FETCH_ERROR',
        });
      }
    }
  },
  async mounted() {
    try {
      this.updateDisplayNameList(this.iscnOwner);
      this.updateNFTOwners();
      this.updateNFTHistory();
      this.lazyFetchLIKEPrice();
      this.fetchUserCollectedCount();
      const blockingPromises = [
        this.fetchISCNMetadata(),
        this.fetchNFTsMetadata({ classId: this.classId, nftId: this.nftId }),
      ];
      const [, nftsMetadata] = await Promise.all(blockingPromises);
      this.nftsMetadata = nftsMetadata;
    } catch (error) {
      if (!error.response?.status === 404) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    } finally {
      this.isLoading = false;
    }

    if (this.action === 'collect') {
      logTrackerEvent(this, 'NFT', 'NFTCollect(NFTWidget)', this.classId, 1);
      this.handleCollect();
    } else {
      logPurchaseFlowEvent(this, 'view_item', {
        name: this.NFTName,
        price: this.NFTPriceUSD,
        currency: 'USD',
        classId: this.classId,
      });
    }
  },
  methods: {
    ...mapActions(['lazyFetchLIKEPrice', 'fetchNFTsMetadata']),
    onSelectNFT(e) {
      const { value: nftId } = e.target;
      logTrackerEvent(this, 'NFT', 'nft_details_select_nft', nftId, 1);
      this.$router.push({
        name: 'nft-class-classId-nftId',
        params: { classId: this.classId, nftId },
      });
    },
    onToggleTransfer() {
      this.isOpenTransferModal = true;
      this.isTransferring = false;

      this.uiSetTxError('');
      this.uiSetTxStatus('');
      this.fetchUserCollectedCount();
    },
    async handleTransfer({ nftId, memo, toWallet }) {
      logTrackerEvent(this, 'NFT', 'NFTTransfer(DetailsPage)', this.nftId, 1);
      this.isTransferring = true;
      await this.transferNFT({ nftId, memo, toWallet });
    },
    async handleCollect() {
      logTrackerEvent(this, 'NFT', 'NFTCollect(DetailsPage)', this.classId, 1);
      try {
        this.isCollecting = true;
        await this.collectNFT();
      } catch (error) {
        // no need to handle error
      } finally {
        this.isCollecting = false;
      }
    },
    handleViewContent() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_page_view_content',
        this.classId,
        1
      );
    },
    handleCollectFromPreviewSection() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTCollect(DetailsPagePreviewSection)',
        this.classId,
        1
      );
      return this.handleCollect();
    },
    handleCollectFromPriceSection() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTCollect(DetailsPagePriceSection)',
        this.classId,
        1
      );
      return this.handleCollect();
    },
    handleCollectFromControlBar() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTCollect(NFTDetailsPageControlBar)',
        this.nftId,
        1
      );
      return this.handleCollect();
    },
    handleClickSellFromPriceSection() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTSellClick(DetailsPagePriceSection)',
        this.classId,
        1
      );
    },
    handleHoverSellFromPriceSection() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTSellHover(DetailsPagePriceSection)',
        this.classId,
        1
      );
    },
    handleCollectFromSupplySection() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTCollect(DetailsPageSupplySection)',
        this.classId,
        1
      );
      return this.handleCollect();
    },
    handleCopyURL() {
      this.shareURLPath({
        title: this.NFTName,
        text: this.NFTDescription,
        path: this.nftClassDetailsPageURL,
        alertMessage: this.$t('tooltip_share_done'),
      });
      logTrackerEvent(this, 'NFT', 'CopyShareURL(Details)', this.classId, 1);
    },
    handleClickUserCollectedCount() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_click_user_collected_count',
        this.nftId,
        1
      );
    },
  },
};
</script>
