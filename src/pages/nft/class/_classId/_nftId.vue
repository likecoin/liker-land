<template>
  <Page class="overflow-x-hidden">
    <CardV2
      v-if="isLoading"
      class="absolute top-[40%]"
    >{{ $t('nft_details_page_label_loading') }}</CardV2>
    <div
      v-else-if="!isLoading && !isMessagePage"
      class="px-[12px] laptop:px-[24px] phone:px-[12px] pb-[120px] w-full"
    >

      <div class="flex flex-col gap-[32px] phone:gap-[16px] w-full max-w-[962px] mx-auto">
        <header
          :class="[
            'flex flex-col items-center w-full sm:flex-row gap-[24px]',
            nftCollectorWalletAddress ? 'justify-between' : 'justify-end',
          ]"
        >
          <NFTMessageIdentity
            v-if="nftCollectorWalletAddress"
            class="phone:order-3 phone:self-center"
            :type="getWalletIdentityType(nftCollectorWalletAddress)"
            :wallet-address="nftCollectorWalletAddress"
            wrapper-classes="!bg-transparent"
          />
          <NFTPageControlBar
            class="phone:order-1"
            :collected-count="ownCount"
            :collected-nft-ids="userCollectedNFTList"
            :class-id="classId"
            :current-nft-id="nftId"
            :next-nft-id="nftIdCollectNext"
            :view="nftIsNew ? 'created' : 'collected'"
            :price="NFTPrice"
            :is-writing-nft="nftIsWritingNFT"
            @transfer="onToggleTransfer"
            @collect="handleCollectFromControlBar"
            @go-to-collect="handleGotoCollectFromControlBar"
            @click-sell="handleClickSellFromControlBar"
            @click-user-collected-count="handleClickUserCollectedCount"
          />
          <hr
            :class="[
              'hidden',
              'phone:block',
              'phone:order-2',
              'h-[2px]',
              'w-full',
              'border-shade-gray',
            ]"
          >
        </header>

        <section class="flex flex-col desktop:grid grid-cols-3 gap-x-[16px] gap-y-[32px]">
          <!-- NFT Message List -->
          <div v-if="!nftIsNew" class="col-span-2 flex flex-col items-center gap-[24px]">
            <NFTPageNFTSelect
              class="phone:order-2"
              :nft-collector-collected-count="nftCollectorCollectedCount"
              :selected-nft-id="selectedNFTId"
              :nft-collector-collected-nft-list="nftCollectorCollectedNFTList"
              @select="onSelectNFT"
            />
            <ul class="flex flex-col gap-[24px] w-full laptop:px-[24px] phone:hidden">
              <NFTMessage
                v-for="m in messageList"
                :key="`${m.txHash}-${m.event}`"
                :type="m.event"
                :from-type="m.fromType"
                :from-wallet="m.fromWallet"
                :to-type="m.toType"
                :to-wallet="m.toWallet"
                :message="m.message"
                :message-type="m.messageType"
                :is-list="true"
                tag="li"
              />
            </ul>

            <!-- phone: NFT Message List -->
            <div
              v-if="messageList.length && messageList[0].message"
              class="hidden flex-col items-center justify-center w-full py-[24px] border-[2px] border-shade-gray rounded-[24px] phone:flex phone:order-1"
            >
              <ul v-if="creatorMessage && creatorMessage.message" class="flex flex-col gap-[24px] w-full px-[16px]">
                <NFTMessage
                  :key="`${creatorMessage.txHash}-${creatorMessage.event}`"
                  :type="creatorMessage.event"
                  :from-type="creatorMessage.fromType"
                  :from-wallet="creatorMessage.fromWallet"
                  :to-type="creatorMessage.toType"
                  :to-wallet="creatorMessage.toWallet"
                  :message="creatorMessage.message"
                  :message-type="creatorMessage.messageType"
                  :is-list="false"
                  tag="li"
                />
              </ul>
              <ButtonV2
                v-if="shouldShowMessageButton"
                preset="outline"
                class="mt-[16px] mb-[8px]"
                :text="$t('nft_details_page_button_view_message', {
                  num: validMessageCount
                })"
                :to="localeLocation({
                  name: 'nft-class-classId-nftId-message',
                  params: { classId, nftId: selectedNFTId }
                })"
              >
                <template #prepend>
                  <IconView />
                </template>
                <template #append>
                  <IconArrowLeft class="rotate-[180deg]" />
                </template>
              </ButtonV2>
            </div>
            <ul
              v-if="messageList.length === 1 && creatorMessage && !creatorMessage.message"
              class="hidden flex-col gap-[24px] w-full px-[16px] phone:flex phone:order-3"
            >
              <NFTMessage
                :key="`${creatorMessage.txHash}-${creatorMessage.event}`"
                :type="creatorMessage.event"
                :from-type="creatorMessage.fromType"
                :from-wallet="creatorMessage.fromWallet"
                :to-type="creatorMessage.toType"
                :to-wallet="creatorMessage.toWallet"
                :message="creatorMessage.message"
                :message-type="creatorMessage.messageType"
                :is-list="true"
                tag="li"
              />
            </ul>
          </div>

          <!-- NFT Preview -->
          <div class="flex flex-col gap-[24px] items-center order-first col-span-1 desktop:order-none">
            <NFTPagePrimitiveDisclaimer v-if="nftIsPrimitive" class="w-full" />
            <NFTGemWrapper :class-id="classId">
              <NFTPagePreviewCard
                :url="nftExternalURL"
                :image-bg-color="nftImageBackgroundColor"
                :image-url="nftImageURL"
                :avatar-url="creatorAvatar"
                :avatar-size="40"
                :is-avatar-outlined="isCreatorCivicLiker"
                :iscn-owner="iscnOwner"
                :iscn-url="iscnURL"
                :display-name="creatorDisplayName"
                :nft-name="nftName"
                :nft-description="nftDescription"
                :nft-price="NFTPrice"
                :collected-count="collectedCount"
                :collector-count="ownerCount"
                :class-collection-type="nftClassCollectionType"
                :class-collection-name="nftClassCollectionName"
                @collect="handleCollectFromPreviewSection"
                @view-content="handleViewContent"
              />
              <NFTFeatured
                :class-id="classId"
                :read-only="!(nftCollectorWalletAddress && nftCollectorWalletAddress.includes(getAddress))"
                :display-state="nftDisplayState"
              />
            </NFTGemWrapper>
            <ButtonV2
              class="text-medium-gray phone:hidden"
              content-class="text-[12px]"
              preset="plain"
              size="mini"
              :to="localeLocation({ name: 'nft-class-classId', params: { classId } })"
            >
              <template #prepend>
                <IconEye class="w-[12px] h-[12px]" />
              </template>
              {{ $t('nft_details_page_button_view_class_page') }}
            </ButtonV2>

            <!-- Do not show  3d model in detail page, pending product design-->
            <!-- <client-only>
              <CardV2
                v-if="isMobile() && nftCollectorWalletAddress === getAddress"
                :class="[
                  'relative',
                  'w-full',
                  'flex',
                  'flex-col',

                  'overflow-hidden',

                  'border-[1px]',
                  'border-shade-gray',
                ]"
              >
                <model-viewer
                  class="w-full h-[300px]"
                  :alt="nftClassCollectionName"
                  :src="nftModelURL"
                  ar
                  auto-rotate
                  auto-rotate-delay="500"
                  xr-environment
                  shadow-intensity="1"
                  camera-controls
                  camera-orbit="225deg 55deg 100m"
                  @click.once="onClickModelViewer"
                />
                <Label
                  class="text-medium-gray text-[12px]"
                  align="center"
                  :text="$t('nft_details_page_label_ar_view_in_mobile')"
                  preset="p6"
                />
              </CardV2>
            </client-only> -->
          </div>
          <!-- NFT Collect CTA -->
          <div
            v-if="nftIsNew"
            class="flex flex-col items-center col-span-2 py-[40px] gap-[24px]"
          >
            <h2 class="text-[32px] leading-1_5 text-center">{{ $t('nft_share_page_creator_title') }}</h2>
            <div class="py-[40px] px-[24px] w-full">
              <NFTMessage
                class="w-full"
                type="purchase"
                from-type="creator"
                :from-wallet="iscnOwner"
                :message="nftCreatorMessageWithParsing"
                :message-type="'collector'"
              />
            </div>
            <div
              class="rounded-[18px] p-[2px] bg-cover bg-[url('/images/gradient/like-gradient-lighter-blur.svg')]"
            >
              <div class="relative p-[6px] bg-gray-f7 rounded-[16px]">
                <ButtonV2
                  :text="$t('nft_details_page_button_collect_now')"
                  preset="secondary"
                  @click="handleCollectFromCreatorMessagePreview"
                >
                  <template #prepend>
                    <IconPrice />
                  </template>
                </ButtonV2>
              </div>
            </div>
          </div>
        </section>

        <Separator class="mx-auto phone:hidden" />

        <section>
          <NFTPageChainDataSection
            id="chain-data"
            :items="populatedDisplayEvents"
            :is-loading="isHistoryInfoLoading"
            :content-url="NFTExternalUrl"
            :iscn-id="iscnId"
            :iscn-url="iscnURL"
            :class-id="classId"
            :nft-id="nftId"
            :content-fingerprints="nftISCNContentFingerprints"
          />
        </section>

        <!-- phone: footer -->
        <section class="flex-col items-center hidden phone:flex">
          <ButtonV2
            class="text-medium-gray"
            content-class="text-[12px]"
            preset="plain"
            size="mini"
            :to="localeLocation({ name: 'nft-class-classId', params: { classId } })"
          >
            <template #prepend>
              <IconEye class="w-[12px] h-[12px]" />
            </template>
            {{ $t('nft_details_page_button_view_class_page') }}
          </ButtonV2>
          <hr
            :class="[
              'hidden',
              'phone:block',
              'h-[2px]',
              'w-full',
              'my-[24px]',
              'border-shade-gray',
            ]"
          >
          <NFTPageControlBar
            :collected-count="ownCount"
            :collected-nft-ids="userCollectedNFTList"
            :class-id="classId"
            :current-nft-id="nftId"
            :next-nft-id="nftIdCollectNext"
            :view="nftIsNew ? 'created' : 'collected'"
            :price="NFTPrice"
            :is-writing-nft="nftIsWritingNFT"
            @transfer="onToggleTransfer"
            @collect="handleCollectFromControlBar"
            @go-to-collect="handleGotoCollectFromControlBar"
            @click-sell="handleClickSellFromControlBar"
            @click-user-collected-count="handleClickUserCollectedCount"
          />
        </section>
      </div>
    </div>
    <NuxtChild
      keep-alive
    />
    <EventModalTransfer
      v-if="classId"
      :is-open="isOpenTransferModal"
      :is-transferring="isTransferring"
      :user-collected-count="userCollectedCount"
      :nft-id="nftId"
      @close="isOpenTransferModal = false; isTransferring = false"
      @submit="handleTransfer"
    />
  </Page>
</template>

<script>
import { mapActions } from 'vuex';
import { isMobile } from '@walletconnect/browser-utils';

import { EXTERNAL_HOST } from '~/constant';

import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import { ellipsis } from '~/util/ui';

import nftMixin from '~/mixins/nft';
import clipboardMixin from '~/mixins/clipboard';
import navigationListenerMixin from '~/mixins/navigation-listener';

export default {
  name: 'NFTDetailsPage',
  layout: 'default',
  filters: {
    ellipsis,
  },
  mixins: [clipboardMixin, nftMixin, navigationListenerMixin],
  head() {
    const title = this.nftName || this.$t('nft_details_page_title');
    const description =
      this.nftDescription || this.$t('nft_details_page_description');
    const ogImage =
      this.nftImageURL || 'https://liker.land/images/og/writing-nft.jpg';
    const schemas = [];
    if (this.purchaseInfo.price) {
      schemas.push({
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
        url: `${EXTERNAL_HOST}${this.$route.path}`,
        offers: {
          '@type': 'Offer',
          price: this.NFTPriceUSD,
          priceCurrency: 'USD',
          availability: 'LimitedAvailability',
        },
      });
    }
    if (this.nftModelURL) {
      schemas.push({
        '@context': 'http://schema.org/',
        '@type': '3DModel',
        image: ogImage,
        name: title,
        encoding: [
          {
            '@type': 'MediaObject',
            contentUrl: this.nftModelURL,
            encodingFormat: 'model/gltf-json',
          },
        ],
      });
    }
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
      script: schemas.length
        ? [
            {
              hid: 'schema',
              innerHTML: JSON.stringify(schemas),
              type: 'application/ld+json',
              body: true,
            },
          ]
        : [],
    };
  },
  data() {
    return {
      // For <select> to change only, please use `this.nftId` instead
      selectedNFTId: this.$route.params.nftId,
      isLoading: true,

      isOpenTransferModal: false,
      isTransferring: false,
      isCollecting: false,
    };
  },
  computed: {
    classId() {
      return this.$route.params.classId;
    },
    nftId() {
      return this.$route.params.nftId;
    },
    isTransferDisabled() {
      return this.isOwnerInfoLoading || !this.userCollectedCount;
    },
    isMessagePage() {
      return this.$route.name === 'nft-class-classId-nftId-message';
    },
    shouldShowMessageButton() {
      const checkIsTransferMessage = msg =>
        msg.message && msg.messageType !== 'creator';
      if (this.messageList.length === 1 && this.creatorMessage?.message) {
        return false;
      }
      if (this.messageList.length > 1 && this.creatorMessage?.message) {
        return true;
      }
      if (
        this.messageList.length > 1 &&
        this.messageList.some(checkIsTransferMessage)
      ) {
        return true;
      }
      return false;
    },
    creatorMessage() {
      return this.messageList.find(
        element => element.event === 'mint_nft' || element.event === 'purchase'
      );
    },
    validMessageCount() {
      return this.messageList.filter(element => element.message).length;
    },
  },
  async asyncData({ route, query, store, redirect, error }) {
    const { action } = query;
    const { classId, nftId } = route.params;
    const { referrer } = route.query;
    if (referrer) {
      redirect({
        name: 'nft-class-classId-share',
        params: { classId },
        query: { referrer },
      });
      return undefined;
    }
    try {
      await Promise.all([
        store.dispatch('lazyGetNFTClassMetadata', classId),
        store.dispatch('lazyGetNFTMetadata', { classId, nftId }),
        store
          .dispatch('lazyGetNFTPurchaseAndListingInfo', classId)
          .catch(err => {
            if (err.response?.data !== 'NFT_CLASS_NOT_FOUND') {
              // eslint-disable-next-line no-console
              console.error(JSON.stringify(err));
            }
          }),
      ]);
    } catch (err) {
      if (err.response?.data?.code === 3) {
        error({
          statusCode: 404,
          message: 'NFT_NOT_FOUND',
        });
      } else {
        // eslint-disable-next-line no-console
        console.error(JSON.stringify(err));
        error({
          statusCode: 500,
          message: 'NFT_FETCH_ERROR',
        });
      }
      return undefined;
    }
    return { action };
  },
  async mounted() {
    try {
      this.lazyGetUserInfoByAddresses(this.iscnOwner);
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
        price: this.NFTPriceUSD,
        currency: 'USD',
        classId: this.classId,
      });
    }
  },
  methods: {
    ...mapActions(['lazyFetchLIKEPrice', 'fetchNFTMetadata']),
    isMobile,
    onSelectNFT(e) {
      const { value: nftId } = e.target;
      logTrackerEvent(this, 'NFT', 'nft_details_select_nft', nftId, 1);
      this.$router.push(
        this.localeLocation({
          name: 'nft-class-classId-nftId',
          params: { classId: this.classId, nftId },
        })
      );
    },
    onToggleTransfer() {
      this.isOpenTransferModal = true;
      this.isTransferring = false;

      this.uiSetTxError('');
      this.uiSetTxStatus('');
      this.fetchUserCollectedCount();
    },
    async handleTransfer({ nftId, memo, toWallet }) {
      logTrackerEvent(this, 'NFT', 'NFTTransfer(DetailsPage)', this.nftId, 1);
      this.isTransferring = true;
      await this.transferNFT({ nftId, memo, toWallet });
    },
    async handleCollect() {
      logTrackerEvent(this, 'NFT', 'nft_details_collect', this.classId, 1);
      try {
        this.isCollecting = true;
        await this.collectNFT();
      } catch (error) {
        // no need to handle error
      } finally {
        this.isCollecting = false;
      }
    },
    handleViewContent() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_page_view_content',
        this.classId,
        1
      );
    },
    onClickModelViewer() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_page_click_model_viewer',
        this.classId,
        1
      );
    },
    handleCollectFromPreviewSection() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_page_collect_from_preview',
        this.nftId,
        1
      );
      return this.handleCollect();
    },
    handleCollectFromCreatorMessagePreview() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_page_collect_from_creator_message_preview',
        this.nftId,
        1
      );
      return this.handleCollect();
    },
    handleCollectFromControlBar() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_page_collect_from_control_bar',
        this.nftId,
        1
      );
      return this.handleCollect();
    },
    handleClickSellFromControlBar() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_sell_from_control_bar',
        this.classId,
        1
      );
    },
    handleGotoCollectFromControlBar() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_page_go_to_collect_from_control_bar',
        this.nftId,
        1
      );
      this.$router.push(
        this.localeLocation({
          name: 'nft-class-classId-nftId',
          params: { classId: this.classId, nftId: this.nftIdCollectNext },
        })
      );
    },
    handleClickUserCollectedCount() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_click_user_collected_count',
        this.nftId,
        1
      );
    },
  },
};
</script>
