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
                  'break-all',
                  'px-[24px]',
                  'pt-[48px]',
                  'py-[24px]',
                  'relative',
                ]"
              >
                <div class="flex flex-col items-center justify-center mt-[-70px]">
                  <Identity
                    :avatar-url="avatarList[iscnOwner]"
                    :avatar-size="40"
                    :is-avatar-outlined="civicLikerList[iscnOwner]"
                  />
                  <NuxtLink
                    class="flex mt-[8px]"
                    :to="`/${iscnOwner}`"
                  >
                    <Label class="text-medium-gray" text="by" />
                    <Label class="text-like-green ml-[4px] font-600">{{
                      displayNameList[iscnOwner] | ellipsis
                    }}</Label>
                  </NuxtLink>
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
            <DropDownList
              :class="[
                'w-full',

                'laptop:ml-[12px]',
                'mb-[16px]',
                'desktop:m-0',
              ]"
              :title="$t('nft_details_page_title_collector')"
            >
              <template #titleIcon>
                <IconPerson />
              </template>
              <template #content>
                <div class="flex flex-col my-[12px]">
                  <div v-if="ownerCount">
                    <div v-for="o in Object.keys(ownerList)" :key="o">
                      <div class="flex items-center justify-between">
                        <LinkV2 :to="`/${o}`">{{ displayNameList[o] || o | ellipsis }}</LinkV2>
                        <Label preset="p6">{{ ownerList[o].length }}</Label>
                      </div>
                      <div
                        :class="[
                          'bg-shade-gray',
                          'h-[1px]',
                          'w-full',
                          'my-[12px]',
                        ]"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <div class="flex justify-center">
                      <Label preset="p6"> - no record found</Label>
                    </div>
                  </div>
                </div>
              </template>
            </DropDownList>
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
          :class="['flex', 'flex-col', 'flex-grow', 'items-center', 'w-full']"
        >
          <!-- Owning count -->
          <div
            class="
              hidden
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
                    v-if="!isSettingAccount && userOwnedCount !== null"
                    preset="h4"
                    :text="`${userOwnedCount}`"
                    class="font-[900] ml-[20px]"
                  />
                  <Label
                    v-if="isSettingAccount || userOwnedCount === null"
                    preset="h4"
                    text="-"
                    class="font-[900] ml-[20px]"
                  />
                </div>
              </template>
              <template #append>
                <div class="tooltip">
                  <ButtonV2
                    preset="tertiary"
                    size="mini"
                    text="Transfer"
                    :is-disabled="true"
                  />
                  <span class="tooltiptext">Comming Soon</span>
                </div>
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
                :text="$t('nft_details_page_collected_count_label')"
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
                :text="$t('nft_details_page_title_collector')"
              >
                <template #prepend>
                  <IconPersonMini />
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
                @click="handleClickCollect"
              >
                <template #prepend>
                  <IconPrice />
                </template>
              </ButtonV2>
              <div class="tooltip">
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
                <span class="tooltiptext">Comming Soon</span>
              </div>
            </div>
          </CardV2>
          <!-- Events -->
          <DropDownList
            class="w-full mb-[250px]"
            title="Item Activity"
          >
            <template #titleIcon>
              <IconActivity />
            </template>
            <template #content>
              <table v-if="NFTHistory.length" class="w-full table-fixed text-[10px]">
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
                    v-for="event in NFTHistory"
                    :key="`${event.txHash}event`"
                    class="py-[12px] border-b-shade-gray border-b-[1px]"
                  >
                    <td>
                      <Label :text="$t('nft_details_page_activity_list_event_collect')">
                        <template #prepend>
                          <IconCircle />
                        </template>
                      </Label>
                    </td>
                    <td>
                      <Label>{{ event.price }}</Label>
                    </td>
                    <td><Label text="-" /></td>
                    <td>
                      <LinkV2 :to="`/${event.toWallet}`">
                        <Label class="break-all">{{
                          displayNameList[event.toWallet] | ellipsis
                        }}</Label>
                      </LinkV2>
                    </td>
                    <td>
                      <LinkV2
                        :href="`https://node.testnet.like.co/cosmos/tx/v1beta1/txs/${event.txHash}`"
                      >
                        <time-ago
                          long
                          tooltip
                          :datetime="event.timestamp"
                        />
                      </LinkV2>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="flex justify-center">
                <Label class="my-[12px]" preset="p6"> - no record found</Label>
              </div>
            </template>
          </DropDownList>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import { TimeAgo } from 'vue2-timeago';

import { getLIKEPrice } from '~/util/api';
import { getNFTCountByClassId } from '~/util/nft';
import { ellipsis } from '~/util/ui';
import DropDownList from '~/components/NFTPage/DropDownList';
import nftMixin from '~/mixins/nft';
import navigationListenerMixin from '~/mixins/navigtion-listener';

export default {
  layout: 'desktop',
  filters: {
    ellipsis,
  },
  components: { TimeAgo, DropDownList },
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
    getLocale() {
      return this.$i18n.locale;
    },
  },
  mounted() {
    this.updateNFTClassMetdata();
    this.updateNFTPurchaseInfo();
    this.updateNFTOwners();
    this.updateNFTHistory();
    this.getLIKEPrice();
  },
  methods: {
    async setAccount(wallet) {
      this.wallet = wallet;
      const { amount } = await getNFTCountByClassId(this.classId, wallet);
      this.userOwnedCount = amount.low;
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
      this.collectNFT();
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
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #9b9b9b;
  color: #fff;
  font-size: 8px;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;

  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.3s;
}

/* Tooltip arrow */
.tooltip .tooltiptext::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #9b9b9b transparent transparent transparent;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
