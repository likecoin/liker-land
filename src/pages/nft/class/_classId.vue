<template>
  <Page>
    <PageHeader class="w-full text-like-green">
      <SiteNavBar />
    </PageHeader>

    <div
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
      <ButtonV2 
        preset="plain"
        class="self-start mb-[12px]"
        text="Back"
        @click="$router.go(-1)"
      >
        <template #prepend>
          <IconArrowLeft />
        </template>
      </ButtonV2>
      <div
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
            'flex',
            'flex-col',

            'w-full',
            'desktop:max-w-[310px]',
            'flex-grow',

            'justify-center',
            'items-center',
            'text-center',
          
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
            <!-- NFT Card -->
            <div
              :class="[
                'flex',
                'flex-col',
                'rounded-[24px]',

                'w-full',
                'laptop:min-w-[310px]',
                'laptop:max-w-[310px]',

                'mb-[16px]',
                'overflow-hidden',
                'bg-white',
              ]"
            >
              <div
                class="h-[180px]"
                :style="`background-color: ${NFTImageBackgroundColor}`"
              >
                <img
                  class="object-cover w-full max-h-[180px]"
                  :src="NFTImageUrl"
                >
              </div>
              <div
                :class="[
                  'flex',
                  'flex-col',
                  'justify-center',
                  'items-center',
                  'whitespace-pre-line',
                  'px-[24px]',
                  'pt-[48px]',
                  'py-[24px]',
                  'relative',
                ]"
              >
                <div class="flex flex-col items-center justify-center mt-[-70px]">
                  <Identity
                    avatar-url=""
                    :avatar-size="40"
                    :is-avatar-outlined="isCivicLiker"
                  />
                  <div class="flex mt-[8px]">
                    <Label class="text-medium-gray" text="by" />
                    <Label class="text-like-green ml-[4px] font-600">{{
                      (iscnOwnerInfo && iscnOwnerInfo.displayName) ||
                        iscnOwner | ellipsis
                    }}</Label>
                  </div>
                </div>
                <Label preset="h5" class="mt-[12px]" :text="NFTName" />
                <Label preset="p5" class="mt-[12px]" :text="NFTDescription" />
                <div class="h-[2px] w-[32px] bg-shade-gray mt-[12px]" />
                <div class="flex justify-center">
                  <ButtonV2
                    preset="outline"
                    class="my-[16px]"
                    :href="NFTExternalUrl"
                    text="View the work"
                  >
                    <template #prepend>
                      <IconView />
                    </template>
                    <template #append>
                      <IconNorthEast />
                    </template>
                  </ButtonV2>
                </div>
                <!-- Metadata desktop:hidden -->
                <div :class="['flex', 'desktop:hidden', 'justify-center']">
                  <ButtonV2 preset="outline" :href="iscnURL" text="Metadata">
                    <template #prepend>
                      <IconCode />
                    </template>
                    <template #append>
                      <IconNorthEast />
                    </template>
                  </ButtonV2>
                </div>
              </div>
            </div>
            <!-- NFT Owners -->
            <CardV2
              :class="[
                'w-full',

                'laptop:ml-[12px]',
                'mb-[16px]',
                'desktop:m-0',
              ]"
            >
              <div
                :class="[
                  'flex',
                  'justify-between',
                  'items-center',
                  'mb-[20px]',
                  'text-like-green',
                ]"
              >
                <Label
                  class="w-min font-600"
                  text="Owners"
                  tag="div"
                  preset="h5"
                  valign="middle"
                  content-class="whitespace-nowrap text-like-green "
                  prepend-class="text-like-green"
                >
                  <template #prepend>
                    <IconPerson />
                  </template>
                </Label>
                <IconArrowDown />
              </div>
              <div :class="['bg-shade-gray', 'h-[2px]', 'w-full', 'my-[12px]']" />
              <div class="flex flex-col my-[12px]">
                <div v-if="ownerCount">
                  <div v-for="o in Object.keys(ownerList)" :key="o">
                    <div class="flex items-center justify-between">
                      <Label preset="p6">{{ o | ellipsis }}</Label>
                      <Label preset="p6">{{ ownerList[o].length }}</Label>
                    </div>
                    <div
                      :class="['bg-shade-gray', 'h-[1px]', 'w-full', 'my-[12px]']"
                    />
                  </div>
                </div>
                <div v-else>
                  <div class="flex justify-center">
                    <Label preset="p6"> - no record found</Label>
                  </div>
                </div>
              </div>
            </CardV2>
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

        <div :class="['flex', 'flex-col','flex-grow','items-center','w-full']">
          <!-- Owning count -->
          <div
            class="
            w-full
            py-[12px]
            px-[24px]
            mb-[16px]
            rounded-[24px]
            bg-white
            border-[2px] border-like-cyan-dark
          "
          >
            <Label preset="h5" text="Owning" class="text-like-green font-600">
              <template #prepend>
                <IconCreativeWork />
              </template>
              <template #default>
                <div class="flex items-center">
                  <Label preset="h5" text="Owning" />
                  <Label
                    v-if="userOwnedCount !== null"
                    preset="h4"
                    :text="userOwnedCount"
                    class="font-[900] ml-[20px]"
                  />
                  <ProgressIndicator v-else preset="thin" class="ml-[20px]" />
                </div>
              </template>
              <template #append>
                <ButtonV2
                  preset="tertiary"
                  size="mini"
                  text="Transfer"
                  :is-disabled="true"
                />
              </template>
            </Label>
          </div>
          <!-- Current Price -->
          <CardV2 class="w-full mb-[16px]">
            <div
              :class="['flex', 'justify-between', 'items-center', 'mb-[20px]']"
            >
              <Label
                class="w-min font-600 mb-[32px]"
                text="Current Price"
                tag="div"
                preset="h5"
                valign="middle"
                content-class="whitespace-nowrap text-like-green"
                prepend-class="text-like-green"
              >
                <template #prepend>
                  <IconPrice />
                </template>
              </Label>
            </div>
            <div class="flex items-baseline justify-start mb-[8px]">
              <Label
                preset="h2"
                class="font-[900] text-like-green"
              >{{ NFTPrice }} $LIKE</Label>
              <Label preset="p5" class="text-medium-gray ml-[4px]">{{
                NFTPriceUSD
              }}</Label>
            </div>
            <div class="flex items-baseline justify-start mb-[28px]">
              <Label
                class="text-[10px] text-medium-gray font-[400]"
                text="Minted"
              >
                <template #prepend>
                  <IconMint />
                </template>
                <template #append>
                  {{ mintedCount }}
                </template>
              </Label>
              <Label
                class="text-[10px] text-medium-gray font-[400] ml-[24px]"
                text="Owners"
              >
                <template #prepend>
                  <IconPerson />
                </template>
                <template #append>
                  {{ ownerCount }}
                </template>
              </Label>
            </div>
            <div class="h-[2px] w-[32px] bg-shade-gray mb-[12px]" />

            <div class="flex items-center justify-start">
              <ButtonV2
                text="Collect Now"
                preset="secondary"
                :href="`https://app.rinkeby.like.co/nfttest/button/${encodeURIComponent(
                  iscnId
                )}%2F1`"
              >
                <template #prepend>
                  <IconPlaceholder />
                </template>
              </ButtonV2>
              <ButtonV2
                class="ml-[12px]"
                text="Sell"
                preset="tertiary"
                :is-disabled="true"
              >
                <template #prepend>
                  <IconPlaceholder />
                </template>
              </ButtonV2>
            </div>
          </CardV2>
          <!-- Events -->
          <CardV2 class="w-full mb-[250px]">
            <div
              :class="[
                'flex',
                'justify-between',
                'items-center',
                'mb-[20px]',
                'text-like-green',
              ]"
            >
              <Label
                class="w-min font-600"
                text="Item Activity"
                tag="div"
                preset="h5"
                valign="middle"
                content-class="whitespace-nowrap text-like-green "
                prepend-class="text-like-green"
              >
                <template #prepend>
                  <IconPlaceholder />
                </template>
              </Label>
              <IconArrowDown />
            </div>
            <div :class="['bg-shade-gray', 'h-[2px]', 'w-full', 'my-[10px]']" />
            <table v-if="history.length" class="w-full table-fixed text-[10px]">
              <thead class="border-b-shade-gray border-b-[2px]">
                <tr class="text-medium-gray py-[12px]">
                  <th><Label text="Event" /></th>
                  <th><Label class="break-normal" text="Price ($LIKE)" /></th>
                  <th><Label text="From" /></th>
                  <th><Label text="To" /></th>
                  <th><Label text="Date" /></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="event in history"
                  :key="`${event.txHash}event`"
                  class="py-[12px] border-b-shade-gray border-b-[1px]"
                >
                  <td>
                    <Label text="Mint">
                      <template #prepend>
                        <IconCircle />
                      </template>
                    </Label>
                  </td>
                  <td>
                    <Label>{{ event.price }}</Label>
                  </td>
                  <td><Label text="mint" /></td>
                  <td>
                    <LinkV2 :to="`/${event.toWallet}`">
                      <Label class="break-all">{{ event.toWallet | ellipsis }}</Label>
                    </LinkV2>
                    
                  </td>
                  <td>
                    <LinkV2 :href="`https://node.testnet.like.co/cosmos/tx/v1beta1/txs/${event.txHash}`">
                      <time-ago long tooltip="top" :datetime="event.timestamp" />
                    </LinkV2>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="flex justify-center">
              <Label class="my-[12px]" preset="p6"> - no record found</Label>
            </div>
          </CardV2>
        </div>
      </div>
    </div></Page>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { APP_LIKE_CO_VIEW } from '~/constant';
import {
  getNFTHistory,
  getAddressLikerIdMinApi,
  getLIKEPrice,
} from '~/util/api';
import { initKeplr } from '~/util/keplr';
import { getNFTCountByClassId } from '~/util/nft';
import { TimeAgo } from 'vue2-timeago';

export default {
  layout: 'desktop',
  filters: {
    ellipsis(value) {
      if (value) {
        const len = value.length;
        const dots = '...';
        if (!value) return '';
        if (value.length > 15) {
          return value.substring(0, 8) + dots + value.substring(len - 3, len);
        }
        return value;
      }
      return value;
    },
  },
  components: { TimeAgo },
  data() {
    return {
      wallet: '',
      userOwnedCount: null,
      iscnOwnerInfo: {},
      history: [],
      displayName: '',
      currentPrice: 0,
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassPurchaseInfoById',
      'getNFTClassMetadataById',
      'getNFTClassOwnerInfoById',
      'getNFTClassOwnerCount',
      'getNFTClassMintedCount',
    ]),
    classId() {
      return this.$route.params.classId;
    },
    isCivicLiker() {
      return !!(
        this.iscnOwnerInfo &&
        (this.iscnOwnerInfo.isCivicLikerTrial ||
          this.iscnOwnerInfo.isSubscribedCivicLiker)
      );
    },
    getCivicLikerId() {
      return this.iscnOwnerInfo && this.iscnOwnerInfo.user;
    },
    NFTClassMetadata() {
      return this.getNFTClassMetadataById(this.classId) || {};
    },
    purcahseInfo() {
      return this.getNFTClassPurchaseInfoById(this.classId) || {};
    },
    ownerInfo() {
      return this.getNFTClassOwnerInfoById(this.classId) || {};
    },
    iscnId() {
      return this.NFTClassMetadata.iscn_id;
    },
    iscnOwner() {
      return this.NFTClassMetadata.iscn_owner;
    },
    // nft info
    NFTName() {
      return this.NFTClassMetadata.name;
    },
    NFTDescription() {
      return this.NFTClassMetadata.description;
    },
    NFTImageUrl() {
      return this.NFTClassMetadata.image;
    },
    NFTImageBackgroundColor() {
      return this.NFTClassMetadata.background_color;
    },
    NFTExternalUrl() {
      return this.NFTClassMetadata.external_url;
    },
    NFTPrice() {
      return this.purcahseInfo.price && this.purcahseInfo.price;
    },
    NFTPriceUSD() {
      const price = this.currentPrice * this.purcahseInfo.price;
      return `(${price.toFixed(3)} USD)`;
    },
    // iscn owner
    iscnURL() {
      return `${APP_LIKE_CO_VIEW}/${encodeURIComponent(this.iscnId)}`;
    },
    ownerList() {
      return this.getNFTClassOwnerInfoById(this.classId) || {};
    },
    ownerCount() {
      return this.getNFTClassOwnerCount(this.classId);
    },
    mintedCount() {
      return this.getNFTClassMintedCount(this.classId);
    },
    getLocale() {
      return this.$i18n.locale;
    },
  },
  watch: {
    NFTClassMetadata: {
      async handler(newValue) {
        if (newValue.iscn_owner) {
          try {
            const { data: info } = await this.$api.get(
              getAddressLikerIdMinApi(newValue.iscn_owner)
            );
            if (info) {
              this.iscnOwnerInfo = info;
            }
            return;
          } catch (error) {
            console.error(error);
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (!this.getNFTClassMetadataById(this.classId)) {
      this.updateNFTClassMetdata();
    }
    if (!this.getNFTClassPurchaseInfoById(this.classId)) {
      this.updateNFTPurchaseInfo();
    }
    if (!this.getNFTClassOwnerInfoById(this.classId)) this.updateNFTOwners();
    this.updateNFTHistory();
    this.getLIKEPrice();
    try {
      setTimeout(async () => {
        const accounts = await initKeplr();
        this.setAccount(accounts[0].address);
      }, 3000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  },
  methods: {
    ...mapActions([
      'fetchNFTPurchaseInfo',
      'fetchNFTMetadata',
      'fetchNFTOwners',
    ]),
    async updateNFTClassMetdata() {
      await this.fetchNFTMetadata(this.classId);
    },
    async updateNFTPurchaseInfo() {
      await this.fetchNFTPurchaseInfo(this.classId);
    },
    async updateNFTOwners() {
      await this.fetchNFTOwners(this.classId);
    },
    async updateNFTHistory() {
      const { data } = await this.$api.get(
        getNFTHistory({ classId: this.classId })
      );
      this.history = data.list;
      console.log('history', this.history);
    },
    async setAccount(wallet) {
      this.wallet = wallet;
      const { amount } = await getNFTCountByClassId(this.classId, wallet);
      this.userOwnedCount = amount.low;
    },
    async updateOwnerName(addr) {
      try {
        const { data } = await this.$api.get(getAddressLikerIdMinApi(addr));
        this.iscnOwnerInfo = data;
        return;
      } catch (error) {
        console.error(error);
      }
    },
    async onPurchase() {
      // buy nft
    },
    async getLIKEPrice() {
      const { data } = await this.$api.get(getLIKEPrice());
      this.currentPrice = data.likecoin.usd;
    },
  },
};
</script>
<style scoped>
th,
td {
  padding-top: 12px;
  padding-bottom: 12px;
  font-weight: 400;
}
</style>
