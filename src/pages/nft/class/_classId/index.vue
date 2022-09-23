<template>
  <Page>
    <CardV2
      v-if="isLoading"
      class="absolute top-[40%]"
    >{{ $t('nft_details_page_label_loading') }}</CardV2>
    <div
      v-else
      :class="[
        'flex',
        'flex-col',
        'px-[12px]',
        'laptop:px-[24px]',
        'self-stretch',

        'w-full',
        'max-w-[1024px]',
        'mx-auto',
        'pb-[120px]',
      ]"
    >
      <div class="flex items-center justify-start mb-[8px]">
        <ButtonV2 preset="plain" text="Back" @click="$router.go(-1)">
          <template #prepend>
            <IconArrowLeft />
          </template>
        </ButtonV2>
      </div>
      <section
        :class="[
          'grid',
          'grid-cols-1',
          'desktop:grid-cols-3',
          'gap-[24px]',
        ]"
      >
        <!-- Left column -->
        <div class="flex flex-col gap-[24px]">
          <div class="grid grid-cols-1 laptop:grid-cols-2 desktop:grid-cols-1 items-stretch gap-[24px]">
            <NFTPagePreviewCard
              :image-bg-color="NFTImageBackgroundColor"
              :image-url="NFTImageUrl"
              :avatar-url="iscnOwnerAvatar"
              :avatar-size="40"
              :is-avatar-outlined="isCivicLiker"
              :iscn-owner="iscnOwner"
              :display-name="iscnOwnerDisplayName"
              :nft-name="NFTName"
              :nft-description="NFTDescription"
              :nft-price="NFTPrice"
              @collect="handleCollectFromPreviewSection"
            />
            <NFTPageMetadataSection
              :content-url="NFTExternalUrl"
              :iscn-id="iscnId"
              :iscn-url="iscnURL"
              :content-fingerprints="nftISCNContentFingerprints"
            />
          </div>
          <NFTPageCollectorList
            class="hidden desktop:block"
            :owner-count="ownerCount"
            :items="populatedCollectors"
            :is-narrow="true"
          />
        </div>

        <!-- Right column -->
        <div class="flex flex-col gap-[24px] desktop:col-span-2">
          <div class="flex items-center w-full">
            <NFTPageOwningSection
              class="mr-[16px]"
              :owned-count="userCollectedCount"
              :is-transfer-disabled="!getAddress || !userCollectedCount"
              :is-loading="isOwnerInfoLoading"
              :is-log-in="!!getAddress"
              :is-transferring="isTransferring"
              @openTransfer="onToggleTransfer"
            />
            <ShareButton @copy="handleCopyURL" />
          </div>
          <NFTPagePriceSection
            v-if="NFTPrice"
            :nft-price="NFTPrice"
            :nft-price-u-s-d="formattedNFTPriceUSD"
            :collected-count="mintedCount"
            :collector-count="ownerCount"
            :is-loading="uiIsOpenCollectModal && isCollecting"
            @collect="handleCollectFromPriceSection"
            @click-sell="handleClickSellFromPriceSection"
            @hover-sell="handleHoverSellFromPriceSection"
          />
          <NFTPageSupplySection
            v-if="isWritingNFT && NFTPrice"
            :collected-count="mintedCount"
            @collect="handleCollectFromSupplySection"
          />
          <NFTPageCollectorList
            class="desktop:hidden"
            :owner-count="ownerCount"
            :items="populatedCollectors"
          />
          <NFTPageEventList
            :items="populatedEvents"
          />
        </div>
      </section>
    </div>
    <EventModalTransfer
      :is-open="isOpenTransferModal"
      :is-transferring="isTransferring"
      :is-ready-to-transfer="isReadyToTransfer"
      :error-msg="errorMsg"
      :to-address="toAddress"
      :user-collected-count="userCollectedCount"
      @close="isOpenTransferModal = false; isTransferring = false"
      @handle-input-addr="handleInputAddr"
      @on-transfer="onTransfer"
    />
  </Page>
</template>

<script>
import { mapActions } from 'vuex';

import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import { LIKE_ADDRESS_REGEX } from '~/util/nft';

import nftMixin from '~/mixins/nft';
import clipboardMixin from '~/mixins/clipboard';
import navigationListenerMixin from '~/mixins/navigation-listener';

export default {
  layout: 'default',
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
                  url: this.$route.path,
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
      toAddress: null,
      isLoading: true,

      currentPrice: 0,
      isOpenTransferModal: false,
      errorMsg: '',
      isReadyToTransfer: false,
      isTransferring: false,
      isCollecting: false,
      hasHoverSellButton: false,
    };
  },
  computed: {
    classId() {
      return this.$route.params.classId;
    },
    isTransferDisabled() {
      return this.isOwnerInfoLoading || !this.userCollectedCount;
    },
  },
  asyncData({ query }) {
    const { action } = query;
    return { action };
  },
  async fetch({ route, store, redirect }) {
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
    await Promise.all([
      store.dispatch('fetchNFTMetadata', classId),
      store
        .dispatch('fetchNFTPurchaseInfo', classId)
        // eslint-disable-next-line no-console
        .catch(err => JSON.stringify(console.error(err))),
    ]);
  },
  async mounted() {
    try {
      this.updateDisplayNameList(this.iscnOwner);
      this.updateNFTOwners();
      this.updateNFTHistory();
      this.lazyFetchLIKEPrice();
      this.fetchUserCollectedCount();
      const blockingPromises = [this.fetchISCNMetadata()];
      await Promise.all(blockingPromises);
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
        price: this.purchaseInfo.price,
        classId: this.classId,
      });
    }
  },
  methods: {
    ...mapActions(['lazyFetchLIKEPrice']),
    onToggleTransfer() {
      this.isOpenTransferModal = true;
      this.isTransferring = false;
      this.isReadyToTransfer = false;
      this.toAddress = null;

      this.uiSetTxError('');
      this.uiSetTxStatus('');
      this.fetchUserCollectedCount();
    },
    async onTransfer() {
      logTrackerEvent(this, 'NFT', 'NFTTransfer(DetailsPage)', this.classId, 1);
      this.isTransferring = true;
      await this.transferNFT();
    },
    handleInputAddr(value) {
      if (!LIKE_ADDRESS_REGEX.test(value)) {
        this.errorMsg = this.$t(
          'nft_details_page_errormessage_transfer_invalid'
        );
        return;
      }
      if (value === this.getAddress) {
        this.errorMsg = this.$t('nft_details_page_errormessage_transfer_self');
        return;
      }
      this.errorMsg = '';
      this.toAddress = value;
      this.isReadyToTransfer = true;
    },
    async handleCollect() {
      logPurchaseFlowEvent(this, 'begin_checkout', {
        name: this.NFTName,
        price: this.purchaseInfo.price,
        classId: this.classId,
      });
      logTrackerEvent(this, 'NFT', 'NFTCollect(DetailsPage)', this.classId, 1);
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected) {
          this.handleCollect();
        }
        return;
      }
      logPurchaseFlowEvent(this, 'add_shipping_info', {
        name: this.NFTName,
        price: this.purchaseInfo.price,
        classId: this.classId,
      });
      try {
        this.isCollecting = true;
        await this.collectNFT();
      } catch (error) {
        // no need to handle error
      } finally {
        this.isCollecting = false;
      }
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
      if (!this.hasHoverSellButton) {
        logTrackerEvent(
          this,
          'NFT',
          'NFTSellHover(DetailsPagePriceSection)',
          this.classId,
          1
        );
        this.hasHoverSellButton = true;
      }
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
      this.copyURLPath(this.nftDetailsPageURL, {
        alertMessage: this.$t('tooltip_share_done'),
      });
      logTrackerEvent(this, 'NFT', 'CopyShareURL(Details)', this.classId, 1);
    },
  },
};
</script>
