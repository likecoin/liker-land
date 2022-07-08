<template>
  <Page>
    <SiteNavBar class="w-full" />
    <div :class="['flex', 'flex-row', 'justify-center', 'mt-[32px]']">
      <div class="mr-[24px]">
        <CardV2 :class="['flex', 'flex-col', 'items-center', 'w-[280px]']">
          <Identity
            v-if="userInfo"
            :avatar-url="userInfo.avatar"
            :avatar-size="88"
            :is-avatar-outlined="isCivicLiker"
          />
          <Label preset="h3" :class="['text-like-green', 'mt-[18px]']">
            {{ getCivicLikerId }}
          </Label>
          <div :class="['w-full', 'h-[1px]', 'bg-shade-gray', 'my-[16px]']" />
          <Label preset="p6" class="font-200">
            {{ getCivicLikerDescription }}
          </Label>
          <ButtonV2
            preset="secondary"
            text="Become Civic Liker"
            class="mt-[16px]"
          />
          <ButtonV2
            preset="secondary"
            text="Like Pay"
            :to="{ name: 'civic' }"
            class="mt-[16px]"
          >
            <template #append>
              <IconNorthEast class="w-[12px]" />
            </template>
          </ButtonV2>
        </CardV2>
      </div>
      <div :class="['flex', 'flex-col', 'items-center']">
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
            text="NFT Collecting"
            :is-selected="currentPage === 'collecting'"
            @click="goCollecting"
          />
          <MenuButtonDivider />
          <MenuButton
            text="Works"
            :is-selected="currentPage === 'works'"
            @click="goWorks"
          />
        </div>

        <ul
          v-if="currentPage === 'collecting'"
          :class="['grid', 'grid-cols-2', 'gap-[12px]']"
        >
          <li v-for="id in ownedNFTClassId" :key="id">
            <div v-if="getNFTClassMetadataById(id)" :class="cardClasses">
              <div
                :style="`background-color: ${
                  getNFTClassMetadataById(id).background_color
                }`"
              >
                <img :src="getNFTClassMetadataById(id).image">
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
                  'relative'
                ]"
              >
                <div class="flex flex-col items-center justify-center mt-[-70px]">
                  <Identity
                    v-if="userInfo"
                    :avatar-url="userInfo.avatar"
                    :avatar-size="40"
                    :is-avatar-outlined="isCivicLiker"
                  />
                  <div class="flex mt-[8px]">
                    <Label class="text-medium-gray">by</Label><Label class="text-like-green">{{ getCivicLikerId }}</Label>
                  </div>
                </div>
                <Label preset="p5" class="mt-[12px]">{{
                  getNFTClassMetadataById(id).description
                }}</Label>
                <div class="flex justify-center">
                  <ButtonV2
                    v-if="getNFTClassPurchaseInfoById(id)"
                    preset="secondary"
                    class="my-[16px]"
                    @click="() => onDetails(id)"
                  >
                    {{ getNFTClassPurchaseInfoById(id).price }} $LIKE
                    <template #prepend>
                      <IconPrice />
                    </template>
                  </ButtonV2>
                  <ButtonV2
                    v-else
                    preset="secondary"
                    text=" - $LIKE"
                    class="my-[16px]"
                    @click="() => onDetails(id)"
                  >
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
            <div v-else class="w-[410px] h-[400px]">
              <div
                :class="[
                  'flex',
                  'justify-center',
                  'items-center',
                  'w-full',
                  'h-full',
                  'rounded-[24px]',
                  'overflow-hidden',
                  'bg-shade-gray',
                ]"
              >
                <IconError class="text-danger" />
              </div>
            </div>
          </li>
        </ul>

        <ul
          v-if="currentPage === 'works'"
          :class="['grid', 'grid-cols-2', 'gap-[12px]']"
        >
          <li v-for="id in sellingNFTClassId" :key="id">
            <div v-if="getNFTClassMetadataById(id)" :class="cardClasses">
              <div
                :style="`background-color: ${
                  getNFTClassMetadataById(id).background_color
                }`"
              >
                <img :src="getNFTClassMetadataById(id).image">
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
                  'relative'
                ]"
              >
                <div class="flex flex-col items-center justify-center mt-[-70px]">
                  <Identity
                    v-if="userInfo"
                    :avatar-url="userInfo.avatar"
                    :avatar-size="40"
                    :is-avatar-outlined="isCivicLiker"
                  />
                  <div class="flex mt-[8px]">
                    <Label class="text-medium-gray">by</Label><Label class="text-like-green">{{ getCivicLikerId }}</Label>
                  </div>
                </div>
                <Label preset="p5" class="mt-[12px]">{{
                  getNFTClassMetadataById(id).description
                }}</Label>
                <div class="flex justify-center">
                  <ButtonV2
                    v-if="getNFTClassPurchaseInfoById(id)"
                    preset="secondary"
                    class="my-[16px]"
                    @click="() => onDetails(id)"
                  >
                    {{ getNFTClassPurchaseInfoById(id).price }} $LIKE
                    <template #prepend>
                      <IconPrice />
                    </template>
                  </ButtonV2>
                  <ButtonV2
                    v-else
                    preset="secondary"
                    text=" - $LIKE"
                    class="my-[16px]"
                    @click="() => onDetails(id)"
                  >
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
            <div v-else class="w-[410px] h-[400px]">
              <div
                :class="[
                  'flex',
                  'justify-center',
                  'items-center',
                  'w-full',
                  'h-full',
                  'rounded-[24px]',
                  'overflow-hidden',
                  'bg-shade-gray',
                ]"
              >
                <IconError class="text-danger" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getUserMinAPI, getUserSellNFTClasses } from '~/util/api';
import { checkUserNameValid } from '~/util/user';
import { getNFTs } from '~/util/nft';
import Identity from '~/components/Identity/Identity';

export default {
  layout: 'desktop',
  components: {
    Identity,
  },
  data() {
    return {
      userInfo: null,
      ownedNFTClassId: [],
      sellingNFTClassId: [],
      currentPage: 'collecting',
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
      return this.userInfo && this.userInfo.user;
    },
    getCivicLikerDescription() {
      return this.userInfo && this.userInfo.description;
    },
    cardClasses() {
      return [
        'flex',
        'flex-col',
        'items-center',
        'rounded-[24px]',
        'overflow-hidden',
        'w-[410px]',
        'bg-white',
      ];
    },
  },
  async asyncData({ route, $api, error }) {
    const { id } = route.params;
    if (id.startsWith('like1')) {
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
    this.fetchUserOwnClasses();
    this.fetchUserSellingClasses();
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
    },
    updateNFTClassData(classId) {
      if (!this.getNFTClassMetadataById(classId)) {
        this.fetchNFTMetadata(classId);
      }
      if (!this.getNFTClassPurchaseInfoById(classId)) {
        this.fetchNFTPurchaseInfo(classId);
      }
      if (!this.getNFTClassOwnerInfoById(classId)) {
        this.fetchNFTOwners(classId);
      }
    },
    onDetails(classId) {
      this.$router.push({ name: 'nft-class-classId', params: { classId } });
    },
    goCollecting() {
      this.currentPage = 'collecting';
    },
    goWorks() {
      this.currentPage = 'works';
    },
  },
};
</script>
