<template>
  <Page>
    <PageHeader class="w-full text-like-green">
      <SiteNavBar />
    </PageHeader>

    <div
      :class="[
        'flex',

        'flex-col',
        'desktop:flex-row',

        'items-center',
        'desktop:items-start',
        'desktop:justify-center',

        'mt-[32px]',
      ]"
    >
      <div
        :class="[
          'mb-[24px]',
          'desktop:mr-[24px]',

          'w-full',
          'desktop:w-[280px]',
        ]"
      >
        <CardV2 :class="['flex', 'flex-col', 'items-center', 'w-full']">
          <Identity
            :avatar-url="userInfo && userInfo.avatar || `https://avatars.dicebear.com/api/identicon/${wallet}.svg`"
            :avatar-size="88"
            :is-avatar-outlined="isCivicLiker"
          />
          <Label preset="h3" :class="['text-like-green', 'mt-[18px]']">
            {{ getCivicLikerId | ellipsis }}
          </Label>
          <div
            v-if="getCivicLikerDescription"
            :class="['w-full', 'h-[1px]', 'bg-shade-gray', 'my-[16px]']"
          />
          <Label preset="p6" class="break-all font-200">
            {{ getCivicLikerDescription }}
          </Label>
        </CardV2>
      </div>
      <div
        :class="[
          'flex',
          'flex-col',
          'items-center',
          'w-full',
          'max-w-[636px]',
          'desktop:w-[636px]',
        ]"
      >
        <div
          :class="[
            'flex',
            'flex-shrink',
            'justify-center',
            'items-center',
            'p-[4px]',
            'mx-auto',
            'mb-[48px]',
            'bg-shade-gray',
            'rounded-[14px]',
          ]"
        >
          <MenuButton
            text="NFT Collection"
            :is-selected="currentPage === 'collection'"
            @click="goCollection"
          />
          <MenuButtonDivider v-if="sellingNFTClassId.length" />
          <MenuButton
            v-if="isLoading || sellingNFTClassId.length"
            text="Works"
            :is-selected="currentPage === 'works'"
            @click="goWorks"
          />
        </div>

        <CardV2 v-if="isLoading">Loading</CardV2>
        <div v-else>
          <ul
            v-if="currentPage === 'collection'"
            :class="[
              'w-full',
              'mx-auto',

              'columns-1',
              'laptop:columns-2',

              'gap-[16px]',
            ]"
          >
            <div
              v-if="!ownedNFTClassId.length"
              :class="[...cardClasses, '!bg-shade-gray','break-inside-avoid']"
            >
              <div class="p-[8px] w-full h-[140px]">
                <div
                  class="z-[5] h-full w-full bg-repeat-space"
                  :style="{
                    backgroundImage: `url(/images/NFT/background_cross.png)`,
                  }"
                />
              </div>
              <div
                class="
                w-full
                pb-[32px]
                bg-shade-gray
                border-t-[1px] border-white
              "
              >
                <div class="flex flex-col justify-center items-center mt-[-21px]">
                  <div class="w-[42px] h-[42px] rounded-[50%] bg-shade-gray border-[2px] border-white" />
                  <Label class="text-medium-gray mt-[12px]" text="no work" />
                </div>
              </div>
            </div>
            <NuxtLink
              v-for="id in ownedNFTClassId"
              :key="id"
              :class="['mx-auto', 'mb-[5px]', 'break-inside-avoid']"
              :to="{ name: 'nft-class-classId', params: { classId: id } }"
              target="_blank"
            >
              <div v-if="getNFTClassMetadataById(id)" :class="cardClasses">
                <div
                  class="h-[180px]"
                  :style="`background-color: ${
                    getNFTClassMetadataById(id).background_color
                  }`"
                >
                  <img
                    class="object-cover w-full max-h-[180px]"
                    :src="getNFTClassMetadataById(id).image"
                  >
                </div>
                <div
                  :class="[
                    'flex',
                    'flex-col',
                    'text-center',
                    'whitespace-pre-line',
                    'px-[24px]',
                    'pt-[48px]',
                    'py-[24px]',
                    'relative',
                  ]"
                >
                  <div
                    class="flex flex-col items-center justify-center mt-[-70px]"
                  >
                    <Identity
                      :avatar-url="avatarList[getNFTClassMetadataById(id).iscn_owner]"
                      :avatar-size="40"
                      :is-avatar-outlined="civicLikerList[getNFTClassMetadataById(id).iscn_owner]"
                    />
                    <div class="flex mt-[8px]">
                      <Label class="text-medium-gray">by</Label><Label class="text-like-green ml-[4px] font-[600]">{{
                        displayNameList[getNFTClassMetadataById(id).iscn_owner] | ellipsis
                      }}</Label>
                    </div>
                  </div>
                  <Label preset="p5" class="mt-[12px] break-all">
                    {{ getNFTClassMetadataById(id).description }}
                  </Label>
                  <div class="z-[500] flex justify-center">
                    <ButtonV2
                      preset="secondary"
                      class="my-[16px]"
                      @click.stop.prevent="collectNFT(getNFTClassMetadataById(id).iscn_id)"
                    >
                      {{ (getNFTClassPurchaseInfoById(id) && getNFTClassPurchaseInfoById(id).price) || '-' }} $LIKE
                      <template #prepend>
                        <IconPrice />
                      </template>
                    </ButtonV2>
                  </div>
                  <div
                    v-if="getNFTClassOwnerInfoById(id)"
                    :class="['flex', 'items-center', 'justify-center']"
                  >
                    <div class="flex items-center text-medium-gray mr-[18px]">
                      <IconMint />
                      <div class="ml-[4px]">{{ getNFTClassMintedCount(id) }}</div>
                    </div>
                    <div class="flex items-center text-medium-gray">
                      <IconOwner />
                      <div class="ml-[4px]">{{ getNFTClassOwnerCount(id) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </ul>

          <ul
            v-if="currentPage === 'works'"
            :class="[
              'w-full',
              'mx-auto',

              'columns-1',
              'laptop:columns-2',

              'gap-[16px]',
            ]"
          >
            <NuxtLink
              v-for="id in sellingNFTClassId"
              :key="id"
              :class="['mx-auto', 'mb-[5px]', 'break-inside-avoid']"
              :to="{ name: 'nft-class-classId', params: { classId: id } }"
              target="_blank"
            >
              <div v-if="getNFTClassMetadataById(id)" :class="cardClasses">
                <div
                  class="h-[180px]"
                  :style="`background-color: ${
                    getNFTClassMetadataById(id).background_color
                  }`"
                >
                  <img
                    class="object-cover w-full max-h-[180px]"
                    :src="getNFTClassMetadataById(id).image"
                  >
                </div>
                <div
                  :class="[
                    'flex',
                    'flex-col',
                    'text-center',
                    'whitespace-pre-line',
                    'px-[24px]',
                    'pt-[48px]',
                    'py-[24px]',
                    'relative',
                  ]"
                >
                  <div
                    class="flex flex-col items-center justify-center mt-[-70px]"
                  >
                    <Identity
                      :avatar-url="avatarList[getNFTClassMetadataById(id).iscn_owner]"
                      :avatar-size="40"
                      :is-avatar-outlined="civicLikerList[getNFTClassMetadataById(id).iscn_owner]"
                    />
                    <div class="flex mt-[8px]">
                      <Label class="text-medium-gray">by</Label><Label class="text-like-green ml-[4px] font-[600]">{{
                        getCivicLikerId | ellipsis
                      }}</Label>
                    </div>
                  </div>
                  <Label preset="h5" class="mt-[12px] break-all">
                    {{ getNFTClassMetadataById(id).name }}
                  </Label>
                  <Label preset="p5" class="mt-[12px] break-all">
                    {{ getNFTClassMetadataById(id).description }}
                  </Label>
                  <div class="z-50 flex justify-center">
                    <ButtonV2
                      preset="secondary"
                      class="my-[16px]"
                      @click.stop.prevent="collectNFT(getNFTClassMetadataById(id).iscn_id, id)"
                    >
                      {{ (getNFTClassPurchaseInfoById(id) && getNFTClassPurchaseInfoById(id).price) || '-' }} $LIKE
                      <template #prepend>
                        <IconPrice />
                      </template>
                    </ButtonV2>
                  </div>
                  <div
                    v-if="getNFTClassOwnerInfoById(id)"
                    :class="['flex', 'items-center', 'justify-center']"
                  >
                    <div class="flex items-center text-medium-gray mr-[18px]">
                      <IconMint />
                      <div class="ml-[4px]">{{ getNFTClassMintedCount(id) }}</div>
                    </div>
                    <div class="flex items-center text-medium-gray">
                      <IconOwner />
                      <div class="ml-[4px]">{{ getNFTClassOwnerCount(id) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </ul>
          <div class="flex flex-col items-center my-[48px] w-full">
            <div class="w-[32px] h-[2px] bg-shade-gray mb-[32px]" />
            <ButtonV2
              preset="outline"
              :text="$t('portfolio_finding_more_button')"
              to="/campaign/writing-nft"
            />
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import {
  getUserMinAPI,
  getUserSellNFTClasses,
  getAddressLikerIdMinApi,
} from '~/util/api';
import { APP_LIKE_CO_URL_BASE } from '~/constant';
import { checkUserNameValid } from '~/util/user';
import { getNFTs } from '~/util/nft';
import Identity from '~/components/Identity/Identity';

export default {
  layout: 'desktop',
  components: {
    Identity,
  },
  filters: {
    ellipsis(value) {
      if (value) {
        const len = value.length;
        const dots = '...';
        if (!value) return '';
        if (value.length > 15) {
          return value.substring(0, 10) + dots + value.substring(len - 5, len);
        }
        return value;
      }
      return value;
    },
  },
  data() {
    return {
      userInfo: null,
      ownedNFTClassId: [],
      sellingNFTClassId: [],
      currentPage: 'works',
      displayNameList: [],
      avatarList: [],
      civicLikerList: [],
      isLoading: true,
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
    isCivicLiker() {
      return !!(
        this.userInfo &&
        (this.userInfo.isCivicLikerTrial ||
          this.userInfo.isSubscribedCivicLiker)
      );
    },
    getCivicLikerId() {
      return (this.userInfo && this.userInfo.displayName) || this.wallet;
    },
    getCivicLikerDescription() {
      return this.userInfo && this.userInfo.description;
    },
    cardClasses() {
      return [
        'flex',
        'flex-col',
        'rounded-[24px]',
        'w-[310px]',
        'mb-[16px]',
        'overflow-hidden',
        'w-full',
        'bg-white',
        'box-border',
        'border-[2px]',
        'border-transparent',
        'hover:border-like-cyan',
        'transition',
        'ease-in',
        'duration-200',
      ];
    },
  },
  async asyncData({ route, $api, error }) {
    const { id } = route.params;
    if (id.startsWith('like1')) {
      try {
        const userInfo = await $api.get(getAddressLikerIdMinApi(id));
        return {
          userInfo: userInfo.data,
          wallet: id,
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      return {
        wallet: id,
      };
    }
    if (id && checkUserNameValid(id)) {
      try {
        const userInfo = await $api.$get(getUserMinAPI(id));
        return {
          userInfo,
          wallet: userInfo.likeWallet,
        };
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    error({ statusCode: 404, message: 'LIKER_NOT_FOUND' });
    return undefined;
  },
  mounted() {
    this.fetchUserSellingClasses();
    this.fetchUserOwnClasses();
  },
  methods: {
    ...mapActions([
      'fetchNFTPurchaseInfo',
      'fetchNFTMetadata',
      'fetchNFTOwners',
    ]),
    async fetchUserOwnClasses() {
      const { nfts } = await getNFTs({ owner: this.wallet });
      const classIdSet = new Set(nfts.map(n => n.classId));
      this.ownedNFTClassId = Array.from(classIdSet);
      this.ownedNFTClassId.forEach(id => this.updateNFTClassData(id));
    },
    async fetchUserSellingClasses() {
      const { data } = await this.$api.get(
        getUserSellNFTClasses({ wallet: this.wallet })
      );
      this.sellingNFTClassId = data.list;
      this.sellingNFTClassId.forEach(id => this.updateNFTClassData(id));
      if (!this.sellingNFTClassId.length) {
        this.currentPage = 'collection';
      }
      this.isLoading = false;
    },
    async updateNFTClassData(classId) {
      if (!this.getNFTClassMetadataById(classId)) {
        await this.fetchNFTMetadata(classId);
      }
      if (!this.getNFTClassPurchaseInfoById(classId)) {
        await this.fetchNFTPurchaseInfo(classId);
      }
      if (!this.getNFTClassOwnerInfoById(classId)) {
        await this.fetchNFTOwners(classId);
      }
      this.UpdateDisplayNameList(
        this.getNFTClassMetadataById(classId).iscn_owner
      );
    },
    collectNFT(iscnid, classId) {
      window.open(
        `${APP_LIKE_CO_URL_BASE}/nft/purchase/${encodeURIComponent(
          iscnid
        )}%2F1`,
        `collect_${this.classId}`,
        'popup=1,width=768,height=576,top=0,left=0'
      );
    },
    goCollection() {
      this.currentPage = 'collection';
    },
    goDetails(classId) {
      this.$router.push({ name: 'nft-class-classId', params: { classId } });
    },
    goWorks() {
      this.currentPage = 'works';
    },
    async UpdateDisplayNameList(addr) {
      if (typeof addr === 'string') {
        this.getAddressLikerId(addr);
        return;
      }
      const results = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const a of addr) {
        results.push(this.getAddressLikerId(a));
      }
      await Promise.all(results);
    },
    async getAddressLikerId(addr) {
      try {
        const { data } = await this.$api.get(getAddressLikerIdMinApi(addr));
        Vue.set(this.displayNameList, addr, data.displayName);
        Vue.set(
          this.avatarList,
          addr,
          data.avatar ||
            `https://avatars.dicebear.com/api/identicon/${addr}.svg`
        );
        Vue.set(this.civicLikerList, addr, true);
      } catch (error) {
        Vue.set(this.displayNameList, addr, addr);
        Vue.set(
          this.avatarList,
          addr,
          `https://avatars.dicebear.com/api/identicon/${addr}.svg`
        );
      }
    },
  },
};
</script>
