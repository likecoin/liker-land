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
          :class="[ 'flex-grow', columnClasses ]"
        >
          <NFTPageOwningSection
            class="hidden"
            :is-setting-account="isSettingAccount"
            :owned-count="userOwnedCount"
          />
          <NFTPagePriceSection
            :nft-price="NFTPrice"
            :nft-price-u-s-d="NFTPriceUSD"
            :minted-count="mintedCount"
            :collector-count="ownerCount"
            @collect="handleClickCollect"
          />
          <NFTPageEventList
            :items="populatedEvents"
          />
        </div>
      </section>
    </main>
  </Page>
</template>

<script>
import { getLIKEPrice } from '~/util/api';
import nftMixin from '~/mixins/nft';
import navigationListenerMixin from '~/mixins/navigtion-listener';

export default {
  layout: 'desktop',
  mixins: [nftMixin, navigationListenerMixin],
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
  },
  async fetch({ route, store }) {
    const { classId } = route.params;
    await store.dispatch('fetchNFTMetadata', classId);
  },
  mounted() {
    this.updateDisplayNameList(this.iscnOwner);
    this.updateNFTPurchaseInfo();
    this.updateNFTOwners();
    this.updateNFTHistory();
    this.getLIKEPrice();
  },
  methods: {
    async onPurchase() {
      // buy nft
    },
    async getLIKEPrice() {
      const { data } = await this.$api.get(getLIKEPrice());
      this.currentPrice = data.likecoin.usd;
    },
    handleClickCollect() {
      // TODO: Log event
      this.collectNFT();
    },
  },
};
</script>
