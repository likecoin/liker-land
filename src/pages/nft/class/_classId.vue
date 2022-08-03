<template>
  <Page>
    <PageHeader class="w-full text-like-green">
      <SiteNavBar />
    </PageHeader>

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
            :is-setting-account="isSettingAccount"
            :owned-count="userOwnedCount"
            :is-transfer-disabled="isTransferDisabled"
            @transfer="onTransfer"
          />
          <NFTPagePriceSection
            :nft-price="NFTPrice"
            :nft-price-u-s-d="NFTPriceUSD"
            :minted-count="mintedCount"
            :collector-count="ownerCount"
            @collect="handleClickCollect"
          />
          <NFTPageEventList
            :nft-history="populatedEvents"
          />
        </div>
      </section>
    </main>
  </Page>
</template>

<script>
import { getLIKEPrice, postNFTTransfer } from '~/util/api';
import { getNFTCountByClassId, transferNFT } from '~/util/nft';
import nftMixin from '~/mixins/nft';
import navigationListenerMixin from '~/mixins/navigtion-listener';
import walletMixin from '~/mixins/wallet';

export default {
  layout: 'desktop',
  mixins: [nftMixin, navigationListenerMixin, walletMixin],
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
      selectedNFTId: 'liker-00fe092b-ea41-487c-9cba-688b93f5b949',
      recipientAddress: 'like1shkl5gqzxcs9yh3qjdeggaz3yg5s83754dx2dh',

      currentPrice: 0,
      isSettingAccount: true,
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
    getAddress(newAddress) {
      this.updateUserOwnedCount(newAddress);
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
      const txHash = await transferNFT({
        fromAddress: this.getAddress,
        toAddress: this.recipientAddress,
        classId: this.classId,
        nftId: this.selectedNFTId,
        signer: this.getSigner,
      });
      await this.$api.post(
        postNFTTransfer({ txHash, nftId: this.selectedNFTId })
      );
    },
    async onPurchase() {
      // buy nft
    },
    async getLIKEPrice() {
      const { data } = await this.$api.get(getLIKEPrice());
      this.currentPrice = data.likecoin.usd;
    },
    handleClickCollect() {
      // TODO: Log event
      if (!this.getAddress) {
        this.connectWallet();
        return;
      }
      this.collectNFT(this.getAddress, this.classId, this.getSigner);
    },
  },
};
</script>
