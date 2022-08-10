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
              :root-class="'laptop:ml-[12px] mb-[16px] desktop:m-0'"
              :owner-count="ownerCount"
              :owner-list="populatedCollectors"
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
          :class="[ 'flex-grow', columnClasses ]"
        >
          <NFTPageOwningSection
            :owned-count="userOwnedCount"
            :is-transfer-disabled="isTransferDisabled"
            :is-loading="isSettingAccount"
            :is-log-in="!!getAddress"
            :is-transferring="isTransferring"
            @openTransfer="isOpenTransferDialog = true;"
          />
          <NFTPagePriceSection
            :nft-price="NFTPrice"
            :nft-price-u-s-d="NFTPriceUSD"
            :minted-count="mintedCount"
            :collector-count="ownerCount"
            :is-loading="isCollecting"
            @collect="onCollect"
          />
          <NFTPageEventList
            :nft-history="populatedEvents"
            :is-loading="isHistoryInfoLoading"
          />
        </div>
      </section>
    </main>
    <Dialog
      v-model="isOpenTransferDialog"
      preset="custom"
      panel-class="shadow-lg bg-white phone:min-w-[380px] min-w-[520px] w-full p-[48px] rounded-[24px]"
      :is-disabled-backdrop-click="true"
    >
      <Label preset="h3" class="font-600 text-like-green mb-[48px]" :text="$t('nft_details_page_title_transfer')" />
      <Label preset="p6" class="text-medium-gray" :text="$t('nft_details_page_label_transfer')" />
      <TextField :placeholder="$t('nft_details_page_placeholder_transfer')" :error-message="errorMsg" @input="handleInputAddr" />
      <div class="flex justify-end w-full mt-[56px]">
        <ProgressIndicator v-if="isTransferring" />
        <ButtonV2
          v-else
          preset="secondary"
          :is-disabled="!isReadyToTransfer"
          :text="$t('nft_details_page_button_transfer')"
          @click="onTransfer"
        />
      </div>
    </Dialog>
    <Snackbar
      v-model="isOpenWarningSnackbar"
      preset="warn"
    >
      {{ errorAlert }}
      <LinkV2
        v-if="errorType === 'INSUFFICIENT_BALANCE'"
        :class="['text-white','ml-[2px]']"
        href="https://docs.like.co/general-guides/trade"
      >
        {{ $t('snackbar_error_buyLIKE') }}
      </LinkV2>
    </Snackbar>
    <Snackbar
      v-model="isOpenSuccessSnackbar"
      preset="success"
    >
      {{ successMsg }}
    </Snackbar>
  </Page>
</template>

<script>
import { getLIKEPrice, postNFTTransfer } from '~/util/api';
import {
  getNFTCountByClassId,
  transferNFT,
  getAccountBalance,
  LIKE_ADDRESS_REGEX,
} from '~/util/nft';
import nftMixin from '~/mixins/nft';
import navigationListenerMixin from '~/mixins/navigtion-listener';
import walletMixin from '~/mixins/wallet';
import errorMixin from '~/mixins/error';

export default {
  layout: 'default',
  mixins: [nftMixin, navigationListenerMixin, walletMixin, errorMixin],
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
      userOwnedCount: null,
      recipientAddress: '',

      currentPrice: 0,
      isSettingAccount: true,

      isOpenTransferDialog: false,
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
      return this.isSettingAccount || !this.userOwnedCount;
    },
  },
  watch: {
    getAddress: {
      immediate: true,
      handler(newAddress) {
        this.updateUserOwnedCount(newAddress);
      },
    },
  },
  async mounted() {
    await Promise.all([
      this.updateNFTClassMetdata(),
      this.updateNFTPurchaseInfo(),
      this.updateNFTOwners(),
      this.updateNFTHistory(),
      this.getLIKEPrice(),
    ]);
    this.isSettingAccount = false;
  },
  methods: {
    async updateUserOwnedCount(address) {
      if (!address) {
        this.userOwnedCount = null;
        return;
      }
      this.isSettingAccount = true;
      const { amount } = await getNFTCountByClassId(this.classId, address);
      this.userOwnedCount = amount.low;
      this.isSettingAccount = false;
    },
    async onTransfer() {
      this.isTransferring = true;
      let result = null;
      try {
        const balance = await getAccountBalance(this.getAddress);
        if (balance === '0') {
          this.isTransferring = false;
          throw new Error('INSUFFICIENT_BALANCE');
        }
        const txHash = await transferNFT({
          fromAddress: this.getAddress,
          toAddress: this.recipientAddress,
          classId: this.classId,
          nftId: this.getTransferNFTId,
          signer: this.getSigner,
        });
        result = await this.$api.post(
          postNFTTransfer({ txHash, nftId: this.getTransferNFTId })
        );
      } catch (error) {
        this.isTransferring = false;
        this.errorHandling(error);
      } finally {
        this.updateNFTData();
        this.updateNFTHistory();
        if (result) {
          this.onTransferComplete();
        }
      }
    },
    onTransferComplete() {
      this.isTransferring = false;
      this.updateUserOwnedCount(this.getAddress);
      this.handleSuccess(this.$t('snackbar_success_transfer'));
    },
    handleInputAddr(value) {
      if (!LIKE_ADDRESS_REGEX.test(value)) {
        this.errorMsg = this.$t('nft_details_page_errormessage_transfer');
      } else {
        this.errorMsg = '';
        this.recipientAddress = value;
        this.isReadyToTransfer = true;
      }
    },
    async onCollect() {
      let result = null;
      if (!this.getAddress) {
        this.connectWallet();
        return;
      }
      try {
        this.isCollecting = true;
        const balance = await getAccountBalance(this.getAddress);
        if (balance === '0') {
          this.isCollecting = false;
          this.errorHandling('INSUFFICIENT_BALANCE');
          return;
        }
        result = await this.collectNFT(
          this.getAddress,
          this.classId,
          this.getSigner
        );
      } catch (error) {
        this.isCollecting = false;
        this.errorHandling(error);
      } finally {
        this.updateNFTData();
        this.updateNFTHistory();
        if (result) {
          this.onCollectComplete();
        }
      }
    },
    onCollectComplete() {
      this.isCollecting = false;
      this.updateUserOwnedCount(this.getAddress);
      this.handleSuccess(this.$t('snackbar_success_collect'));
    },
    async getLIKEPrice() {
      try {
        const { data } = await this.$api.get(getLIKEPrice());
        this.currentPrice = data.likecoin.usd;
      } catch (error) {
        this.errorHandling('LIKE_PRICE_IS_TEMPORARY_UNAVAILABLE');
      }
    },
  },
};
</script>
