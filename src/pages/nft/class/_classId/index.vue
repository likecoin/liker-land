<template>
  <Page class="overflow-hidden">
    <CardV2 v-if="isLoading" class="absolute top-[40%]">{{
      $t('nft_details_page_label_loading')
    }}</CardV2>
    <div v-else class="px-[12px] laptop:px-[24px] pb-[120px] w-full">
      <div class="flex flex-col gap-[24px] w-full max-w-[962px] mx-auto">
        <NFTPageControlBar
          :collected-count="ownCount"
          :class-id="classId"
          :price="controlBarPriceLabel"
          :collected-nft-ids="userCollectedNFTList"
          :next-nft-id="nftIdCollectNext"
          :is-writing-nft="nftIsWritingNFT"
          :is-collectable="nftIsCollectable"
          @transfer="onToggleTransfer"
          @click-sell="handleClickSellFromControlBar"
          @collect="handleCollectFromControlBar"
          @go-to-collect="handleGotoCollectFromControlBar"
        />

        <!-- CTA -->
        <NFTPageCollectCTA
          v-if="nftIsWritingNFT"
          :class-id="classId"
          :nft-image-url="NFTImageUrl"
          :creator-message="creatorMessage"
          :iscn-owner="iscnOwner"
          :is-collectable="nftIsCollectable"
          :is-free="nftIsFree"
          :own-count="ownCount"
          :collect-expiry-time="collectExpiryTime"
          :is-mid-autumn-style="nftIsMidAutumnStyle"
          @click-cta-button="handleCollectFromCTA"
        />

        <template v-if="nftIsNFTBook">
          <NFTBookItemCard
            :class-id="classId"
            preset="details"
            @click-avatar="handleNFTCardClickAvatar"
          >
            <template #column-left>
              <ul
                class="flex gap-[16px] justify-center items-center mt-[24px] text-medium-gray text-[12px]"
              >
                <li class="flex items-center">
                  <IconMint />
                  <span class="ml-[4px]">{{ collectedCount }}</span>
                </li>
                <li class="flex items-center">
                  <IconOwner />
                  <span class="ml-[4px]">{{ ownerCount }}</span>
                </li>
              </ul>

              <NFTViewOptionList
                class="mt-[24px] mb-[48px]"
                :url="externalUrl"
                :class-id="classId"
                :content-urls="iscnContentUrls"
                :iscn-url="iscnUrl"
                :is-nft-book="nftIsNFTBook"
                :is-content-viewable="isContentViewable"
                :is-content-downloadable="!nftIsDownloadHidden"
                :should-show-content-url-buttons="false"
                @view-content="handleViewContent"
                @view-content-url="handleViewContentURL"
              />
            </template>

            <template #column-right>
              <Separator />

              <NFTEditionSelect
                class="self-stretch"
                :items="nftEditions"
                :should-show-notify-button="false"
                :value="defaultSelectedValue"
                @change="handleEditionSelectChange"
                @click-collect="handleCollectFromEditionSelector"
                @click-gift="handleGiftFromEditionSelector"
                @click-compare="handleClickCompareItemsButton"
              />
            </template>
          </NFTBookItemCard>
          <div
            v-if="
              nftBookAvailablePriceLabel &&
                (nftEditions.length > 1 ||
                  (nftEditions.length === 1 && nftEditions[0].description))
            "
            ref="compareSection"
            class="max-w-[962px] mx-auto flex flex-col justify-center"
          >
            <Label
              :text="$t('nft_edition_label')"
              preset="h3"
              align="center"
              class="text-like-green mt-[38px] mb-[24px]"
            />
            <ul
              class="flex flex-wrap items-start justify-center gap-[24px] w-full"
            >
              <li
                v-for="editionConfig in nftEditions"
                :key="editionConfig.name"
              >
                <NFTBookEditionCompareTableColumn
                  class="w-[280px]"
                  :src="NFTImageUrl"
                  :edition-config="editionConfig"
                  :class-id="classId"
                  @click-collect="handleCollectFromEditionCompareTable"
                />
              </li>
            </ul>
          </div>

          <Separator class="mx-auto" />
          <client-only>
            <lazy-component
              class="pointer-events-none"
              @show.once="fetchTrimmedCollectorsInfo"
            />
          </client-only>
          <NFTPageCollectorList
            :class-id="classId"
            :owner-count="ownerCount"
            :items="populatedBuyerWithMessage"
            :trimmed-count="trimmedCount"
            @click-show-more-collector="handleClickMoreCollector"
          />
        </template>
        <section
          v-else
          class="flex flex-col desktop:grid grid-cols-3 gap-[24px]"
        >
          <!-- Left column -->
          <div
            :class="[
              'col-span-1 grid desktop:grid-cols-1 gap-[24px]',
              { 'laptop:grid-cols-2': isShowPriceSection },
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
                :iscn-work-author="iscnWorkAuthor"
                :iscn-url="iscnURL"
                :display-name="creatorDisplayNameFull"
                :class-id="classId"
                :nft-name="NFTName"
                :nft-description="NFTDescription"
                :nft-price="NFTPrice"
                :collected-count="collectedCount"
                :collector-count="ownerCount"
                :class-collection-type="nftClassCollectionType"
                :class-collection-name="nftClassCollectionName"
                :is-content-viewable="isContentViewable"
                :is-content-downloadable="!nftIsDownloadHidden"
                @view-content="handleViewContent"
                @view-content-url="handleViewContentURL"
                @click-avatar="handleNFTCardClickAvatar"
              />
            </NFTGemWrapper>
          </div>

          <Separator class="mx-auto desktop:hidden" />

          <!-- Right column -->
          <div class="relative flex flex-col gap-[24px] desktop:col-span-2">
            <NFTPagePriceSection
              v-if="isShowPriceSection && nftIsPrimitive"
              :nft-price="NFTPrice"
              :nft-price-u-s-d="formattedNFTPriceInUSD"
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
            <client-only>
              <lazy-component
                class="absolute inset-0 pointer-events-none -top-full"
                @show.once="fetchTrimmedCollectorsInfo"
              />
            </client-only>
            <NFTPageCollectorList
              :class-id="classId"
              :owner-count="ownerCount"
              :items="populatedCollectorsWithMemo"
              :trimmed-count="trimmedCount"
              :is-narrow="true"
              @click-show-more-collector="handleClickMoreCollector"
            />
            <NFTPagePrimitiveClassInfoSection
              v-if="nftIsPrimitive"
              :class-id="classId"
              :collected-count="collectedCount"
              :collector-count="ownerCount"
            />
            <NFTPageSupplySection
              v-else-if="
                isShowPriceSection && nftIsWritingNFT && nftIsCollectable
              "
              :sold-count="nftSoldCount"
              :current-price="NFTPrice"
              :base-price="nftBasePrice"
              @collect="handleCollectFromSupplySection"
            />
          </div>
        </section>

        <Separator class="mx-auto" />
        <section>
          <NFTPageChainDataSection
            id="chain-data"
            :items="populatedDisplayEvents"
            :show-price="!nftIsNFTBook"
            :show-memo="true"
            :is-loading="isHistoryInfoLoading"
            :content-url="externalUrl"
            :iscn-id="iscnId"
            :iscn-url="iscnURL"
            :class-id="classId"
            :content-fingerprints="nftISCNContentFingerprints"
            :is-download-hidden="nftIsDownloadHidden"
            @click-show-more-history="handleClickMoreHistory"
          />
        </section>
        <!-- recommend -->
        <client-only>
          <lazy-component
            class="pointer-events-none"
            @show.once="handleFetchRecommendInfo"
          />
        </client-only>
        <NFTPageRecommendation
          :iscn-owner="iscnOwner"
          :should-show-follow-button="shouldShowFollowButton"
          :is-followed="isFollowed"
          :recommended-list="recommendedList"
          :is-loading="isRecommendationLoading"
          @header-avatar-click="handleRecommendationHeaderAvatarClick"
          @follow-button-click="handleFollowButtonClick"
          @item-click="handleRecommendedItemClick"
          @item-collect="handleRecommendedItemCollect"
          @slide-next.once="handleRecommendationSlideNext"
          @slide-prev.once="handleRecommendationSlidePrev"
          @slider-move.once="handleRecommendationSliderMove"
        />
        <!-- useful links -->
        <section>
          <ul
            class="flex flex-row gap-[8px] items-center justify-center text-medium-gray underline text-[8px]"
          >
            <li>
              <a class="hover:underline " target="_blank" :href="rawDataURL">
                {{ $t('nft_class_footer_raw') }}
              </a>
            </li>
            <li>
              <a class="hover:underline" target="_blank" :href="nftWidgetURL">
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
    <NFTBookGiftDialog
      :open="isGiftDialogOpen"
      :selected-value="giftSelectedValue"
      @submit="handleGiftSubmit"
      @close="() => (isGiftDialogOpen = false)"
    />
  </Page>
</template>

<script>
import { nftClassCollectionType } from '~/util/nft';
import { getNFTBookPurchaseLink } from '~/util/api';
import {
  logTrackerEvent,
  logPurchaseFlowEvent,
  getGaClientId,
} from '~/util/EventLogger';
import {
  EXTERNAL_HOST,
  NFT_BOOK_PLATFORM_LIKER_LAND,
  LIKECOIN_API_BASE,
  LIKECOIN_BUTTON_BASE,
} from '~/constant';

import nftMixin from '~/mixins/nft';
import clipboardMixin from '~/mixins/clipboard';
import navigationListenerMixin from '~/mixins/navigation-listener';

export default {
  name: 'NFTClassDetailsPage',
  mixins: [clipboardMixin, nftMixin, navigationListenerMixin],
  layout: 'default',
  asyncData({ query }) {
    const { action } = query;
    return { action };
  },
  data() {
    return {
      isLoading: true,

      isOpenTransferModal: false,
      isTransferring: false,
      isCollecting: false,

      isGiftDialogOpen: false,
      giftSelectedValue: 0,

      trimmedCount: 10,
    };
  },
  async fetch({ route, store, redirect, error, localeLocation }) {
    const { classId } = route.params;
    const { referrer } = route.query;
    if (referrer) {
      redirect(
        localeLocation({
          name: 'nft-class-classId-share',
          params: { classId },
          query: { referrer },
        })
      );
      return;
    }
    // check classId contains only valid characters
    if (!/^likenft1[ac-hj-np-z02-9]{58}$/.test(classId)) {
      error({
        statusCode: 400,
        message: 'INVALID_NFT_CLASS_ID',
      });
      return;
    }
    try {
      const [metadata] = await Promise.all([
        store.dispatch('lazyGetNFTClassMetadata', classId),
        store
          .dispatch('lazyGetNFTPurchaseAndListingInfo', classId)
          .catch(err => {
            if (err.response?.data !== 'NFT_CLASS_NOT_FOUND') {
              // eslint-disable-next-line no-console
              console.error(JSON.stringify(err));
            }
          }),
      ]);
      if (metadata?.nft_meta_collection_id?.includes('nft_book')) {
        await store
          .dispatch('fetchNFTBookInfoByClassId', classId)
          .catch(error => {
            if (error.response?.status !== 400) {
              throw error;
            }
          });
      }
    } catch (err) {
      if (err.response?.data?.code === 3) {
        error({
          statusCode: 404,
          message: 'NFT_NOT_FOUND',
        });
      } else {
        // eslint-disable-next-line no-console
        console.error(err);
        error({
          statusCode: 500,
          message: 'NFT_FETCH_ERROR',
        });
      }
    }
  },
  head() {
    let title = this.NFTName || this.$t('nft_details_page_title');
    if (this.nftIsNFTBook) {
      title += ` - ${this.$t('nft_details_page_title_book')}`;
    } else if (!title.includes(this.$t('nft_details_page_title_article'))) {
      title += ` - ${this.$t('nft_details_page_title_article')}`;
    }
    const description =
      this.NFTDescription || this.$t('nft_details_page_description');
    const ogImage =
      this.NFTImageUrl ||
      `${EXTERNAL_HOST}/images/og/${
        this.$i18n.locale !== 'en' ? 'default-zh.png' : 'default.png'
      }`;
    const schemas = [];
    const iscnOwnerPerson = {
      '@context': 'http://www.schema.org',
      '@type': 'Person',
      url: `${EXTERNAL_HOST}/${this.iscnOwner}`,
      identifier: this.iscnOwner,
    };
    if (this.purchaseInfo.price) {
      // TODO: check if we can use last purchase price if current price is -1
      const NFTPriceUSD = Math.max(this.NFTPriceUSD, 0);
      schemas.push({
        '@context': 'http://www.schema.org',
        '@type': ['CreativeWork', 'Product'],
        name: title,
        image: [ogImage],
        description,
        brand: {
          '@type': 'Brand',
          url: `${EXTERNAL_HOST}/writing-nft/about`,
          name: 'Writing NFT',
        },
        sku: this.classId,
        iscn: this.iscnId,
        url: `${EXTERNAL_HOST}${this.$route.path}`,
        offers: {
          '@type': 'Offer',
          seller: iscnOwnerPerson,
          price: NFTPriceUSD,
          priceCurrency: 'USD',
          availability:
            this.NFTPriceUSD >= 0 ? 'LimitedAvailability' : 'OutOfStock',
        },
      });
    }
    if (this.nftEditions) {
      const bookSchema = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        '@id': this.iscnId,
        url: `${EXTERNAL_HOST}${this.$route.path}`,
        name: title,
        image: [ogImage],
        description,
        brand: {
          '@type': 'Brand',
          name: 'NFT Book',
        },
        author: iscnOwnerPerson,
        sku: this.classId,
        iscn: this.iscnId,
        workExample: [],
      };
      this.nftEditions.forEach(e => {
        bookSchema.workExample.push({
          '@type': ['Book', 'Product'],
          name: title,
          image: [ogImage],
          iscn: this.iscnId,
          bookEdition: e.name,
          description: e.description,
          brand: {
            '@type': 'Brand',
            name: 'NFT Book',
          },
          offers: {
            '@type': 'Offer',
            seller: iscnOwnerPerson,
            price: e.price,
            priceCurrency: 'USD',
            availability: e.stock ? 'LimitedAvailability' : 'OutOfStock',
          },
        });
      });
      schemas.push(bookSchema);
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
    const meta = [
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
    ];
    if (this.isNFTHidden) {
      meta.push({
        hid: 'robots',
        name: 'robots',
        content: 'noindex',
      });
    }
    const link = [];
    if (this.nftIsWritingNft) {
      link.push({
        hid: 'alternate-json-oembed',
        type: 'application/json+oembed',
        rel: 'alternate',
        href: `${LIKECOIN_API_BASE}/oembed?url=${encodeURIComponent(
          `${LIKECOIN_BUTTON_BASE}/nft?class_id=${this.classId}`
        )}&format=json`,
        title,
      });
      link.push({
        hid: 'alternate-xml-oembed',
        type: 'application/xml+oembed',
        rel: 'alternate',
        href: `${LIKECOIN_API_BASE}/oembed?url=${encodeURIComponent(
          `${LIKECOIN_BUTTON_BASE}/nft?class_id=${this.classId}`
        )}&format=xml`,
        title,
      });
    }
    return {
      title,
      meta,
      link,
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
  computed: {
    classId() {
      return this.$route.params.classId;
    },
    platform() {
      return this.$route.query.from || NFT_BOOK_PLATFORM_LIKER_LAND;
    },
    isTransferDisabled() {
      return this.isOwnerInfoLoading || !this.userCollectedCount;
    },
    isShowPriceSection() {
      return this.NFTPrice !== undefined && this.NFTPrice > 0;
    },
    creatorMessage() {
      return this.NFTClassMetadata?.message;
    },
    isFollowed() {
      return this.walletFollowees?.includes(this.iscnOwner) || false;
    },
    isContentViewable() {
      return !(this.nftIsNFTBook && !this.ownCount);
    },
    defaultSelectedValue() {
      return this.nftEditions[this.editionPriceIndex || 0]?.value;
    },
    shouldShowFollowButton() {
      return Boolean(this.iscnOwner !== this.getAddress);
    },
    populatedCollectorsWithMemo() {
      if (!this.populatedDisplayEvents) {
        return this.populatedCollectors;
      }
      const collectorsWithMemo = this.populatedCollectors.map(collector => {
        const event = this.populatedDisplayEvents.find(
          event =>
            event.event === 'purchase' &&
            event.toWallet === collector.id &&
            event.granterMemo
        );

        if (event) {
          return { ...collector, memo: event.granterMemo };
        }
        return collector;
      });

      if (collectorsWithMemo && collectorsWithMemo.length) {
        collectorsWithMemo.sort((a, b) => {
          if (a.memo && !b.memo) {
            return -1;
          }
          if (!a.memo && b.memo) {
            return 1;
          }
          return b.collectedCount - a.collectedCount;
        });
      }
      return collectorsWithMemo;
    },
    populatedBuyerWithMessage() {
      if (!this.populatedDisplayEvents) {
        return this.populatedCollectors;
      }

      const filteredEvents = this.populatedDisplayEvents.filter(
        event => event.buyerMessage
      );

      const collectorsWithBuyerMessages = this.populatedCollectors.map(
        buyer => {
          const event = filteredEvents.find(
            event => buyer.id === event.toWallet
          );

          if (event) {
            return { ...buyer, memo: event.buyerMessage };
          }
          return buyer;
        }
      );
      if (collectorsWithBuyerMessages && collectorsWithBuyerMessages.length) {
        collectorsWithBuyerMessages.sort((a, b) => {
          if (a.memo && !b.memo) {
            return -1;
          }
          if (!a.memo && b.memo) {
            return 1;
          }
          return b.collectedCount - a.collectedCount;
        });
      }
      return collectorsWithBuyerMessages;
    },
  },
  async mounted() {
    try {
      this.lazyGetUserInfoByAddress(this.iscnOwner);
      this.fetchIscnOwnerNFTDisplayStateList();
      this.updateNFTOwners();
      this.fetchUserCollectedCount();
      if (this.nftClassCollectionType === nftClassCollectionType.NFTBook) {
        this.fetchNFTBookInfoByClassId(this.classId).catch();
        this.fetchNFTBookPaymentPriceInfo();
      }
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
        items: [
          {
            name: this.NFTName,
            classId: this.classId,
            price: this.NFTPriceUSD,
          },
        ],
        price: this.NFTPriceUSD,
        currency: 'USD',
      });
    }
  },
  methods: {
    async fetchTrimmedCollectorsInfo() {
      const trimmedCollectors = this.sortedOwnerListId.slice(
        0,
        this.trimmedCount
      );
      await Promise.all([
        this.lazyGetUserInfoByAddresses(trimmedCollectors),
        this.updateNFTHistory({ getAllUserInfo: false }),
      ]);
    },
    async handleFetchRecommendInfo() {
      await this.fetchRecommendInfo();
    },
    async handleClickMoreCollector() {
      logTrackerEvent(
        this,
        'NFT',
        'class_details_show_more_collector_clicked',
        this.classId,
        1
      );
      await this.lazyGetUserInfoByAddresses(this.sortedOwnerListId);
    },
    async handleClickMoreHistory() {
      logTrackerEvent(
        this,
        'NFT',
        'class_details_show_more_history_clicked',
        this.classId,
        1
      );
      await this.updateNFTHistory({ getAllUserInfo: true });
    },
    onToggleTransfer() {
      this.isOpenTransferModal = true;
      this.isTransferring = false;

      this.uiSetTxError('');
      this.uiSetTxStatus('');
      this.fetchUserCollectedCount();
    },
    async handleCollect() {
      logTrackerEvent(this, 'NFT', 'NFTCollect(DetailsPage)', this.classId, 1);

      if (this.nftIsNFTBook) {
        await this.handleCollectFromEdition(this.defaultSelectedValue);
        return;
      }

      try {
        this.isCollecting = true;
        await this.collectNFT();
      } catch (error) {
        // no need to handle error
      } finally {
        this.isCollecting = false;
      }
    },
    handleNFTCardClickAvatar() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_card_avatar_clicked',
        this.classId,
        1
      );
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
    handleViewContentURL(type) {
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
    async handleCollectFromEdition(selectedValue, giftInfo = undefined) {
      const editions = this.getNFTBookStorePricesByClassId(this.classId) || {};
      const edition = editions[selectedValue];
      const hasStock = edition?.stock;
      if (!hasStock && !this.nftIsCollectable) return;

      if (hasStock) {
        const purchaseEventParams = {
          items: [
            {
              name: this.NFTName,
              price: edition.price,
              classId: this.classId,
            },
          ],
          price: edition.price,
          currency: 'USD',
          isNFTBook: true,
        };
        logPurchaseFlowEvent(this, 'add_to_cart', purchaseEventParams);
        logPurchaseFlowEvent(this, 'begin_checkout', purchaseEventParams);
        if (edition.price === 0) {
          this.$router.push(
            this.localeLocation({
              name: 'nft-claim',
              query: {
                class_id: this.classId,
                type: 'nft_book',
                free: true,
                price_index: edition.index,
                from: 'liker_land_waived',
              },
            })
          );
        } else if (edition.price > 0 && this.nftPriceInLIKE > 0) {
          await this.initIfNecessary();
          if (this.hasConnectedWallet) {
            logPurchaseFlowEvent(
              this,
              'add_shipping_info',
              purchaseEventParams
            );
            this.fetchUserCollectedCount();
            this.walletFetchLIKEBalance();
          }
          this.uiToggleCollectModal({ classId: this.classId });
        } else {
          const gaClientId = await getGaClientId(this);
          const link = getNFTBookPurchaseLink({
            classId: this.classId,
            priceIndex: edition.index,
            platform: this.platform,
          });
          const { url } = await this.$axios.$post(link, {
            gaClientId,
            giftInfo,
          });
          if (url) {
            window.location.href = url;
          } else {
            throw new Error('Failed to get purchase link');
          }
        }
      } else if (this.nftIsCollectable) {
        this.handleGotoCollectFromControlBar();
      }
    },
    async handleCollectFromEditionSelector(selectedValue) {
      await this.handleCollectFromEdition(selectedValue);
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_edition_selector_collect',
        this.classId,
        1
      );
    },
    async handleGiftSubmit({ selectedValue, giftInfo }) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_gift_submit',
        this.classId,
        1
      );
      await this.handleCollectFromEdition(selectedValue, giftInfo);
      this.isGiftDialogOpen = false;
    },
    handleGiftFromEditionSelector(selectedValue) {
      this.giftSelectedValue = selectedValue;
      this.isGiftDialogOpen = true;
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_edition_selector_gift',
        this.classId,
        1
      );
    },
    async handleCollectFromEditionCompareTable(selectedValue) {
      await this.handleCollectFromEdition(selectedValue);
      logTrackerEvent(
        this,
        'NFT',
        `nft_class_details_edition_compare_table_collect`,
        this.classId,
        1
      );
    },
    async handleEditionSelectChange(selectedValue) {
      await this.$router.replace({
        query: {
          ...this.$route.query,
          price_index: selectedValue,
        },
      });
      await this.lazyFetchNFTBookPaymentPriceInfo();
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_edition_selector_change',
        this.classId,
        1
      );
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
    async handleFollowButtonClick() {
      await this.handleClickFollow({
        followOwner: this.iscnOwner,
      });
      if (this.isFollowed) {
        logTrackerEvent(
          this,
          'NFT',
          'nft_class_details_click_unfollow',
          this.classId,
          1
        );
      } else {
        logTrackerEvent(
          this,
          'NFT',
          'nft_class_details_click_follow',
          this.classId,
          1
        );
      }
    },
    handleRecommendationHeaderAvatarClick() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_recommend_header_avatar_click',
        this.classId,
        1
      );
    },
    handleRecommendedItemClick(classId) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_recommend_item_click',
        classId,
        1
      );
    },
    handleRecommendedItemCollect(classId) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_recommend_item_collect',
        classId,
        1
      );
    },
    handleRecommendationSlideNext() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_recommendation_clicked_next',
        this.classId,
        1
      );
    },
    handleRecommendationSlidePrev() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_recommendation_clicked_prev',
        this.classId,
        1
      );
    },
    handleRecommendationSliderMove() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_recommendation_moved_slider',
        this.classId,
        1
      );
    },
    handleClickCompareItemsButton() {
      this.$nextTick(() =>
        this.$refs.compareSection.scrollIntoView({ behavior: 'smooth' })
      );
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_compare_button_clicked',
        this.classId,
        1
      );
    },
  },
};
</script>
