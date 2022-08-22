<template>
  <Page>
    <main
      :class="[
        'flex',
        'flex-col',
        'mx-auto',
        'w-full',
        'max-w-[1024px]',
        'mt-[8px]',
        'px-[24px]',
      ]"
    >
      <section
        :class="[
          'flex',

          'flex-col',
          'desktop:flex-row',

          'items-center',
          'justify-center',
          'desktop:justify-center',
          'desktop:items-start',

          'w-full',
        ]"
      >
        <div
          :class="[
            columnClasses,
            'desktop:max-w-[310px]',
            'desktop:mr-[24px]',
          ]"
        >
          <div
            :class="[
              'flex',

              'flex-col',
              'laptop:flex-row',
              'desktop:flex-col',

              'justify-center',
              'w-full',
            ]"
          >
            <NFTPageItemCard
              :root-class="'laptop:w-[310px]'"
              :image-bg-color="NFTImageBackgroundColor"
              :image-url="NFTImageUrl"
              :avatar-url="avatarList[iscnOwner]"
              :avatar-size="40"
              :is-avatar-outlined="civicLikerList[iscnOwner]"
              :iscn-owner="iscnOwner"
              :display-name="displayNameList[iscnOwner]"
              :nft-name="NFTName"
              :nft-description="NFTDescription"
              :nft-external-url="NFTExternalUrl"
              :iscn-url="iscnURL"
            />
            <NFTPageCollectorList
              class="laptop:ml-[12px] mb-[16px] desktop:m-0"
              :owner-count="ownerCount"
              :items="populatedCollectors"
            />
          </div>
          <!-- Metadata -->
          <div :class="['hidden', 'desktop:flex', 'justify-center']">
            <ButtonV2
              preset="outline"
              class="my-[16px]"
              :href="iscnURL"
              text="Metadata"
            >
              <template #prepend>
                <IconCode />
              </template>
              <template #append>
                <IconNorthEast />
              </template>
            </ButtonV2>
          </div>
        </div>

        <div
          :class="['flex-grow', columnClasses ]"
        >
          <NFTPageOwningSection
            :owned-count="userOwnedCount"
            :is-transfer-disabled="isTransferDisabled"
            :is-loading="isOwnerInfoLoading"
            :is-log-in="!!getAddress"
            :is-transferring="isTransferring"
            @openTransfer="onToggleTransfer"
          />
          <NFTPagePriceSection
            :nft-price="NFTPrice"
            :nft-price-u-s-d="NFTPriceUSD"
            :minted-count="mintedCount"
            :collector-count="ownerCount"
            :is-loading="uiIsOpenCollectModal && isCollecting"
            @collect="onCollect"
          />
          <NFTPageEventList :items="populatedEvents" />
        </div>
      </section>
    </main>
    <TxModal
      :is-open="isOpenTransferModal"
      :has-close-button="!isTransferring"
      :header-text="$t('nft_details_page_title_transfer')"
      @close="isOpenTransferModal = false; isTransferring = false"
    >
      <template #header-prepend>
        <IconTransfer />
      </template>
      <div>
        <NFTPageOwning />
        <div v-if="!isTransferring">
          <Label preset="p6" class="text-medium-gray" :text="$t('nft_details_page_label_transfer')" />
          <TextField
            :placeholder="$t('nft_details_page_placeholder_transfer')"
            :error-message="errorMsg"
            @input="handleInputAddr"
          />
          <div class="flex justify-center mt-[24px]">
            <ButtonV2
              preset="secondary"
              :is-disabled="!isReadyToTransfer"
              :text="$t('nft_details_page_button_transfer')"
              @click="onTransfer"
            />
          </div>
        </div>
        <div v-else class="flex justify-center w-ful mb-[12px] border-0 border-dashed border-b-[2px] border-b-shade-gray">
          <FormField :label="$t('tx_modal_label_send')">{{ toAddress }}</FormField>
        </div>
      </div>
    </TxModal>
  </Page>
</template>

<script>
import { getLIKEPrice } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';
import { LIKE_ADDRESS_REGEX } from '~/util/nft';
import nftMixin from '~/mixins/nft';
import navigationListenerMixin from '~/mixins/navigtion-listener';
import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';

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
    columnClasses() {
      return [
        'flex',
        'flex-col',
        'flex-grow',
        'justify-center',
        'items-center',
        'text-center',
        'w-full',
      ];
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
  async fetch({ route, store }) {
    const { classId } = route.params;
    await store.dispatch('fetchNFTMetadata', classId);
  },
  async mounted() {
    await Promise.all([
      this.updateDisplayNameList(this.iscnOwner),
      this.updateNFTPurchaseInfo(),
      this.updateNFTOwners(),
      this.updateNFTHistory(),
      this.getLIKEPrice(),
    ]);
    this.isOwnerInfoLoading = false;
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
        this.errorMsg = this.$t('nft_details_page_errormessage_transfer');
      } else {
        this.errorMsg = '';
        this.toAddress = value;
        this.isReadyToTransfer = true;
      }
    },
    async onCollect() {
      logTrackerEvent(this, 'NFT', 'NFTCollect(DetailsPage)', this.classId, 1);
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected) {
          this.onCollect();
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
    async getLIKEPrice() {
      try {
        const { data } = await this.$api.get(getLIKEPrice());
        this.currentPrice = data.likecoin.usd;
      } catch (error) {
        this.alertPromptError('LIKE_PRICE_IS_TEMPORARY_UNAVAILABLE');
      }
    },
  },
};
</script>
