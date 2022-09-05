<template>
  <Page>
    <CardV2
      v-if="isLoading"
      class="absolute top-[40%]"
    >{{ $t('nft_details_page_label_loading') }}</CardV2>
    <div
      v-else
      :class="[
        'mt-[8px]',
        'px-[12px]',
        'laptop:px-[24px]',
        'self-stretch',
      ]"
    >
      <section
        :class="[
          'grid',
          'grid-cols-1',
          'desktop:grid-cols-3',
          'gap-[24px]',

          'w-full',
          'max-w-[1024px]',
          'mx-auto',
          'pb-[120px]',
        ]"
      >
        <!-- Left column -->
        <div class="flex flex-col gap-[24px]">
          <div class="grid grid-cols-1 laptop:grid-cols-2 desktop:grid-cols-1 items-stretch gap-[24px]">
            <NFTPagePreviewCard
              :image-bg-color="NFTImageBackgroundColor"
              :image-url="NFTImageUrl"
              :avatar-url="avatarList[iscnOwner]"
              :avatar-size="40"
              :is-avatar-outlined="civicLikerList[iscnOwner]"
              :iscn-owner="iscnOwner"
              :display-name="displayNameList[iscnOwner]"
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
              :owned-count="userOwnedCount"
              :is-transfer-disabled="!getAddress || !userOwnedCount"
              :is-loading="isOwnerInfoLoading && !!getAddress"
              :is-log-in="!!getAddress"
              :is-transferring="isTransferring"
              @openTransfer="onToggleTransfer"
            />
            <ShareButton @copy="handleCopyURL" />
          </div>
          <NFTPagePriceSection
            v-if="NFTPrice"
            class="mt-[16px]"
            :nft-price="NFTPrice"
            :nft-price-u-s-d="NFTPriceUSD"
            :collected-count="mintedCount"
            :collector-count="ownerCount"
            :is-loading="uiIsOpenCollectModal && isCollecting"
            @collect="handleCollectFromPriceSection"
          />
          <NFTPageSupplySection
            v-if="isWritingNFT && NFTPrice"
            class="mt-[16px]"
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
      @close="isOpenTransferModal = false; isTransferring = false"
      @handle-input-addr="handleInputAddr"
      @on-transfer="onTransfer"
    />
  </Page>
</template>

<script>
import { getLIKEPrice } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';
import { copyToClipboard } from '~/util/ui';
import { LIKE_ADDRESS_REGEX } from '~/util/nft';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';
import navigationListenerMixin from '~/mixins/navigation-listener';

export default {
  layout: 'default',
  mixins: [nftMixin, navigationListenerMixin, walletMixin, alertMixin],
  head() {
    const title = this.NFTName || this.$t('nft_details_page_title');
    const description =
      this.NFTDescription || this.$t('nft_details_page_description');
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
          content:
            this.NFTImageUrl || 'https://liker.land/images/og/writing-nft.jpg',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
  data() {
    return {
      toAddress: null,
      isLoading: true,

      currentPrice: 0,
      isOwnerInfoLoading: true,
      isOpenTransferModal: false,
      errorMsg: '',
      isReadyToTransfer: false,
      isTransferring: false,
      isCollecting: false,
    };
  },
  computed: {
    classId() {
      return this.$route.params.classId;
    },
    NFTPriceUSD() {
      const price = this.currentPrice * this.purchaseInfo.price;
      return `(${price.toFixed(3)} USD)`;
    },
    isTransferDisabled() {
      return this.isOwnerInfoLoading || !this.userOwnedCount;
    },
  },
  watch: {
    getAddress: {
      immediate: true,
      handler(newAddress) {
        this.updateUserCollectedCount(this.classId, newAddress);
      },
    },
  },
  asyncData({ query }) {
    const { action } = query;
    return { action };
  },
  async fetch({ route, store }) {
    const { classId } = route.params;
    await store.dispatch('fetchNFTMetadata', classId);
  },
  async mounted() {
    try {
      const promises = [
        this.updateDisplayNameList(this.iscnOwner),
        this.updateNFTOwners(),
        this.updateNFTHistory(),
        this.getLIKEPrice(),
        this.fetchISCNMetadata(),
      ];
      if (this.isWritingNFT) promises.push(this.updateNFTPurchaseInfo());
      await Promise.all(promises);
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
    }
  },
  methods: {
    onToggleTransfer() {
      this.isOpenTransferModal = true;
      this.isTransferring = false;
      this.isReadyToTransfer = false;
      this.toAddress = null;

      this.uiSetTxError('');
      this.uiSetTxStatus('');
      this.updateUserCollectedCount(this.classId, this.getAddress);
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
      logTrackerEvent(this, 'NFT', 'NFTCollect(DetailsPage)', this.classId, 1);
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected) {
          this.handleCollect();
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
    async getLIKEPrice() {
      try {
        const { data } = await this.$api.get(getLIKEPrice());
        this.currentPrice = data.likecoin.usd;
      } catch (error) {
        this.alertPromptError('LIKE_PRICE_IS_TEMPORARY_UNAVAILABLE');
      }
    },
    handleCopyURL() {
      const host = `${window.location.protocol}//${window.location.host}`;
      const { path } = this.$route;
      const url = `${host}${path}?referrer=${this.getAddress}`;

      copyToClipboard(url);
      logTrackerEvent(this, 'NFT', 'CopyShareURL(Details)', url, 1);

      this.alertPromptSuccess(this.$t('tooltip_share_done'));
    },
  },
};
</script>
