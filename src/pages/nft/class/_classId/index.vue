<template>
  <Page>
    <CardV2 v-if="isLoading" class="absolute top-[40%]">{{ $t('nft_details_page_label_loading') }}</CardV2>
    <div v-else class="px-[12px] laptop:px-[24px] pb-[120px] w-full">

      <div class="flex flex-col gap-[24px] w-full max-w-[962px] mx-auto">
        <div class="flex items-center justify-end w-full">
          <NFTPageControlBar
            :collected-count="ownCount"
            :class-id="classId"
            :price="NFTPrice"
            :collected-nft-ids="userCollectedNFTList"
            :next-nft-id="nftIdCollectNext"
            :is-writing-nft="nftIsWritingNFT"
            @transfer="onToggleTransfer"
            @click-sell="handleClickSellFromControlBar"
            @collect="handleCollectFromControlBar"
            @go-to-collect="handleGotoCollectFromControlBar"
          />
        </div>

        <!-- CTA -->
        <NFTPageCollectCTA
          v-if="!isExperimenting && nftIsWritingNFT"
          :nft-image-url="NFTImageUrl"
          :creator-message="creatorMessage"
          :iscn-owner="iscnOwner"
          @click-collect-from-cta="handleCollectFromCTA"
        />

        <section class="flex flex-col desktop:grid grid-cols-3 gap-[24px]">
          <NFTPagePrimitiveDisclaimer v-if="nftIsPrimitive" :is-nft-book="nftIsNFTBook" class="w-full desktop:hidden" />

          <!-- Left column -->
          <div
            :class="[
              'col-span-1 grid desktop:grid-cols-1 gap-[24px]',
              { 'laptop:grid-cols-2': isShowPriceSection }
            ]"
          >
            <NFTGemWrapper :class-id="classId" :is-nft-book="nftIsNFTBook">
              <NFTPagePreviewCard
                :url="externalUrl"
                :content-urls="iscnContentUrls"
                :image-bg-color="NFTImageBackgroundColor"
                :image-url="NFTImageUrl"
                :animation-url="NFTAnimationUrl"
                :avatar-url="creatorAvatar"
                :avatar-size="40"
                :is-avatar-outlined="isCreatorCivicLiker"
                :is-nft-book="nftIsNFTBook"
                :iscn-owner="iscnOwner"
                :iscn-url="iscnURL"
                :display-name="creatorDisplayName"
                :nft-name="NFTName"
                :nft-description="NFTDescription"
                :nft-price="NFTPrice"
                :collected-count="collectedCount"
                :collector-count="ownerCount"
                :class-collection-type="nftClassCollectionType"
                :class-collection-name="nftClassCollectionName"
                :is-content-viewable="!(nftIsNFTBook && !ownCount)"
                @view-content="handleViewContent"
                @view-content-urls="handleViewContentUrls"
              />
            </NFTGemWrapper>
          </div>

          <Separator class="mx-auto desktop:hidden" />

          <!-- Right column -->
          <div class="flex flex-col gap-[24px] desktop:col-span-2">
            <NFTPagePrimitiveDisclaimer v-if="nftIsPrimitive" :is-nft-book="nftIsNFTBook" class="hidden w-full desktop:flex" />
            <NFTPageCollectCTA
              v-if="isExperimenting && nftIsWritingNFT"
              :nft-image-url="NFTImageUrl"
              :creator-message="creatorMessage"
              :iscn-owner="iscnOwner"
              @click-collect-from-cta="handleCollectFromCTA"
            />
            <NFTPagePriceSection
              v-if="isShowPriceSection && nftIsPrimitive"
              :nft-price="NFTPrice"
              :nft-price-u-s-d="formattedNFTPriceUSD"
              :is-collectable="nftIsCollectable"
              :collected-count="collectedCount"
              :collector-count="ownerCount"
              :is-content-viewable="!(nftIsNFTBook && !ownCount)"
              :is-loading="uiIsOpenCollectModal && isCollecting"
              :url="externalUrl"
              @collect="handleCollectFromPriceSection"
              @click-sell="handleClickSellFromPriceSection"
              @hover-sell="handleHoverSellFromPriceSection"
            />
            <NFTPageCollectorList
              :class-id="classId"
              :owner-count="ownerCount"
              :items="populatedCollectors"
              :is-narrow="true"
            />
            <NFTPagePrimitiveClassInfoSection
              v-if="nftIsPrimitive"
              :class-id="classId"
              :collected-count="collectedCount"
              :collector-count="ownerCount"
            />
            <NFTPageSupplySection
              v-else-if="isShowPriceSection && nftIsWritingNFT && nftIsCollectable"
              :sold-count="nftSoldCount"
              @collect="handleCollectFromSupplySection"
            />
          </div>
        </section>

        <Separator class="mx-auto" />

        <section>
          <NFTPageChainDataSection
            id="chain-data"
            :items="populatedDisplayEvents"
            :show-memo="true"
            :is-loading="isHistoryInfoLoading"
            :content-url="externalUrl"
            :iscn-id="iscnId"
            :iscn-url="iscnURL"
            :class-id="classId"
            :content-fingerprints="nftISCNContentFingerprints"
          />
        </section>
        <!-- recommend -->
        <section>
          <div class="flex flex-col gap-[8px] bg-like-green rounded-[24px] py-[32px] overflow-hidden">
            <div class="flex items-center justify-between px-[32px]">
              <NFTMessageIdentity
                type="creator"
                class="flex-shrink-0"
                :wallet-address="iscnOwner"
                :avatar-size="40"
              />
              <ButtonV2 preset="tertiary" size="mini">
                {{ $t('follow') }}
              </ButtonV2>
            </div>
            <ul class="relative pl-[32px] py-[12px] flex justify-start items-start gap-[24px] w-full overflow-x-scroll overflow-y-auto scrollbar-custom">
              <li v-for="(nft, index) in recommendedList" :key="index">
                <NFTPortfolioItem
                  :class-id="nft.classId"
                  :portfolio-wallet="iscnOwner"
                />
              </li>
            </ul>
          </div>
        </section>
        <!-- useful links -->
        <section>
          <ul class="flex flex-row gap-[8px] items-center justify-center text-medium-gray underline text-[8px]">
            <li>
              <a
                class="hover:underline "
                target="_blank"
                :href="rawDataURL"
              >
                {{ $t('nft_class_footer_raw') }}
              </a>
            </li>
            <li>
              <a
                class="hover:underline"
                target="_blank"
                :href="nftWidgetURL"
              >
                {{ $t('nft_class_footer_widget') }}
              </a>
            </li>
            <li>
              <a
                class="hover:underline"
                target="_blank"
                :href="nftWidgetImageURL"
              >
                {{ $t('nft_class_footer_image') }}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapActions } from 'vuex';

import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import { EXTERNAL_HOST } from '~/constant';

import nftMixin from '~/mixins/nft';
import clipboardMixin from '~/mixins/clipboard';
import navigationListenerMixin from '~/mixins/navigation-listener';
import experimentMixin from '~/mixins/experiment';

export default {
  name: 'NFTClassDetailsPage',
  layout: 'default',
  mixins: [
    clipboardMixin,
    nftMixin,
    navigationListenerMixin,
    experimentMixin('isExperimenting', 'class-collect-cta', 'variant'),
  ],
  head() {
    const title = this.NFTName || this.$t('nft_details_page_title');
    const description =
      this.NFTDescription || this.$t('nft_details_page_description');
    const ogImage =
      this.NFTImageUrl || 'https://liker.land/images/og/writing-nft.jpg';
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
        {
          hid: 'likecoin:wallet',
          name: 'likecoin:wallet',
          content: this.iscnOwner,
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
    isTransferDisabled() {
      return this.isOwnerInfoLoading || !this.userCollectedCount;
    },
    isShowPriceSection() {
      return this.NFTPrice !== undefined && this.NFTPrice > 0;
    },
    creatorMessage() {
      return this.messageList.find(
        element => element.event === 'mint_nft' || element.event === 'purchase'
      );
    },
  },
  asyncData({ query }) {
    const { action } = query;
    return { action };
  },
  async fetch({ route, store, redirect, error }) {
    const { classId } = route.params;
    const { referrer } = route.query;
    if (referrer) {
      redirect({
        name: 'nft-class-classId-share',
        params: { classId },
        query: { referrer },
      });
      return;
    }
    try {
      await Promise.all([
        store.dispatch('fetchNFTClassMetadata', classId),
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
    }
  },
  async mounted() {
    try {
      this.lazyGetUserInfoByAddresses(this.iscnOwner);
      this.updateNFTOwners();
      this.updateNFTHistory();
      this.lazyFetchLIKEPrice();
      this.fetchUserCollectedCount();
      const blockingPromises = [
        this.fetchISCNMetadata(),
        this.fetchNFTListByAddress(this.iscnOwner),
        this.fetchNFTListByAddress(this.getAddress),
        this.fetchNFTDisplayStateListByAddress(this.iscnOwner),
      ];
      await Promise.all(blockingPromises);
    } catch (error) {
      if (!error.response?.status === 404) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    } finally {
      this.isLoading = false;
    }

    const { hash } = this.$route;
    if (hash) {
      this.$nextTick(() => {
        try {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } catch {
          // No-op
        }
      });
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
    ...mapActions(['lazyFetchLIKEPrice']),
    onToggleTransfer() {
      this.isOpenTransferModal = true;
      this.isTransferring = false;

      this.uiSetTxError('');
      this.uiSetTxStatus('');
      this.fetchUserCollectedCount();
    },
    async handleCollect() {
      logTrackerEvent(this, 'NFT', 'NFTCollect(DetailsPage)', this.classId, 1);
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
    handleViewContentUrls(type) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_details_page_view_content_url',
        type,
        1
      );
    },
    handleCollectFromCTA() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTCollect(DetailsPageCTA)',
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
    handleClickSellFromControlBar() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_sell_from_control_bar',
        this.classId,
        1
      );
    },
    handleCollectFromControlBar() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTCollect(ClassDetailsPageControlBar)',
        this.nftId,
        1
      );
      return this.handleCollect();
    },
    handleGotoCollectFromControlBar() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTGotoCollect(ClassDetailsPageControlBar)',
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
    handleClickSellFromPriceSection() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTSellClick(DetailsPagePriceSection)',
        this.classId,
        1
      );
    },
    handleHoverSellFromPriceSection() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTSellHover(DetailsPagePriceSection)',
        this.classId,
        1
      );
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
    handleCopyURL() {
      this.shareURLPath({
        title: this.NFTName,
        text: this.NFTDescription,
        path: this.nftClassDetailsPageURL,
        alertMessage: this.$t('tooltip_share_done'),
      });
      logTrackerEvent(this, 'NFT', 'CopyShareURL(Details)', this.classId, 1);
    },
  },
};
</script>
