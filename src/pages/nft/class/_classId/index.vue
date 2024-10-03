<template>
  <Page class="relative">
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
                :nft-id="nftIdCollectedFirstByUser"
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

            <template #column-edition-select>
              <NFTEditionSelect
                class="self-stretch"
                :items="nftEditions"
                :should-show-notify-button="false"
                :value="defaultSelectedValue"
                @change="handleEditionSelectChange"
                @click-collect="handleCollectFromEditionSelector"
                @click-add-to-cart="handleClickAddToCart"
                @click-gift="handleGiftFromEditionSelector"
                @click-compare="handleClickEditionCompareButton"
                @input-custom-price="handleInputCustomPrice"
              />
              <div
                v-if="nftCollections.length"
                class="items-center justify-end w-full mt-[12px]"
                @click="handleClickCollectionHint"
              >
                <Label
                  class="underline text-like-collection !text-[14px] cursor-pointer"
                  align="right"
                  :text="$t('nft_collection_hint')"
                >
                  <template #append>
                    <IconCollection />
                  </template>
                </Label>
              </div>
            </template>
          </NFTBookItemCard>

          <section
            v-if="nftCollections?.length"
            ref="collectionSection"
            class="flex flex-col items-center gap-[24px] w-full py-[24px]"
          >
            <h3
              class="text-[28px] font-600 text-center text-like-collection"
              v-text="$t('nft_collection_label')"
            />
            <ul
              class="flex flex-wrap items-start justify-center gap-[16px] w-full"
            >
              <li
                v-for="collection in nftCollections"
                :key="collection.id"
                class="max-w-[280px] w-full"
              >
                <NuxtLink
                  :to="
                    localeLocation({
                      name: 'nft-collection-collectionId',
                      params: { collectionId: collection.id },
                    })
                  "
                >
                  <NFTBookEditionCompareTableColumn
                    :collection-id="collection.id"
                    :src="parseNFTMetadataURL(collection.image)"
                    :edition-config="collection"
                    @click-collect="
                      handleClickCollectionFromEditionCompareTable({
                        collectionId: collection.id,
                      })
                    "
                  />
                </NuxtLink>
              </li>
            </ul>
          </section>

          <NFTBookSignatureBanner
            v-if="nftHasSignImage"
            tag="section"
            :name="iscnWorkAuthor || creatorDisplayNameFull"
            @click="handleSignatureBannerClick"
            @scroll-to-bottom="handleSignatureBannerScrollToBottom"
          />

          <!-- recommend -->
          <section>
            <client-only>
              <lazy-component
                class="pointer-events-none"
                @show.once="handleFetchRecommendInfo"
              />
            </client-only>
            <NFTPageRecommendation
              :iscn-owner="iscnOwner"
              :iscn-work-author="iscnWorkAuthor"
              :should-show-follow-button="shouldShowFollowButton"
              :is-followed="isFollowed"
              :recommended-list="recommendedList"
              :is-book-nft="nftIsNFTBook"
              :is-loading="isRecommendationLoading"
              @header-avatar-click="handleRecommendationHeaderAvatarClick"
              @follow-button-click="handleFollowButtonClick"
              @item-click="handleRecommendedItemClick"
              @item-collect="handleRecommendedItemCollect"
              @slide-next.once="handleRecommendationSlideNext"
              @slide-prev.once="handleRecommendationSlidePrev"
              @slider-move.once="handleRecommendationSliderMove"
            />
          </section>

          <section
            v-if="
              nftBookAvailablePriceLabel &&
                (nftEditions.length > 1 ||
                  (nftEditions.length === 1 && nftEditions[0].description))
            "
            ref="editionCompareSection"
            class="flex flex-col items-center gap-[24px] w-full py-[24px]"
          >
            <h3
              class="text-[28px] font-600 text-center text-like-green"
              v-text="$t('nft_edition_label')"
            />
            <ul
              class="flex flex-wrap items-start justify-center gap-[16px] w-full"
            >
              <li
                v-for="(editionConfig, i) in nftEditions"
                :key="`${editionConfig.name}-${i}`"
                class="w-full max-w-[280px]"
              >
                <NFTBookEditionCompareTableColumn
                  :class-id="classId"
                  :src="NFTImageUrl"
                  :edition-config="editionConfig"
                  @click-collect="handleCollectFromEditionCompareTable"
                />
              </li>
            </ul>
          </section>

          <Separator class="mx-auto" />

          <section>
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
          </section>
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
                :nft-id="nftIdCollectedFirstByUser"
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
              :is-content-viewable="!(nftIsNFTBook && !isOwningNFT)"
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
            :is-nft-book="nftIsNFTBook"
            @click-show-more-history="handleClickMoreHistory"
          />
        </section>

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
            <template v-if="nftIsWritingNFT">
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
            </template>
          </ul>
        </section>
      </div>
    </div>
    <NFTBookGiftDialog
      :open="isGiftDialogOpen"
      @submit="handleGiftSubmit"
      @close="handleGiftClose"
    />
    <NFTBookTippingDialog
      :open="isTippingDialogOpen"
      :creator-avatar="creatorAvatar"
      :display-name="creatorDisplayNameFull"
      :currency="defaultCurrency"
      :class-id="classId"
      :is-loading="isOpeningCheckoutPage"
      :price="formattedNFTPriceInUSD"
      @on-submit="handleSubmitTipping"
      @on-skip="handleSkipTipping"
      @close="handleCloseTippingDialog"
    />

    <NFTBookCrossSellDialog
      :open="isCrossSellDialogOpen"
      :class-id="crossSellClassId"
      :collection-id="crossSellCollectionId"
      @accept="handleCrossSellAccept"
      @reject="handleCrossSellReject"
    />

    <Bodhisattva18BannerCTA
      v-if="isShowBanner"
      class="w-full"
      @click-button="handleClickBookBannerCTA"
    />
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { nftClassCollectionType, parseNFTMetadataURL } from '~/util/nft';
import { getNFTBookPurchaseLink, postNewStripeFiatPayment } from '~/util/api';
import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import {
  USD_TO_HKD_RATIO,
  EXTERNAL_HOST,
  NFT_BOOK_PLATFORM_LIKER_LAND,
  LIKECOIN_API_BASE,
  LIKECOIN_BUTTON_BASE,
} from '~/constant';

import nftMixin from '~/mixins/nft';
import clipboardMixin from '~/mixins/clipboard';
import crossSellMixin from '~/mixins/cross-sell';
import navigationListenerMixin from '~/mixins/navigation-listener';
import utmMixin from '~/mixins/utm';

export default {
  name: 'NFTClassDetailsPage',
  mixins: [
    clipboardMixin,
    crossSellMixin,
    nftMixin,
    navigationListenerMixin,
    utmMixin,
  ],
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
      isTippingDialogOpen: false,
      isAddingToCart: false,
      isTriggerFromEditionSelector: false,
      giftSelectedValue: 0,

      trimmedCount: 10,

      customPrice: 0,
      selectedValue: 0,
      isOpeningCheckoutPage: false,
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
      await Promise.all([
        store.dispatch('lazyGetNFTClassMetadata', classId),
        store
          .dispatch('lazyGetNFTPurchaseAndListingInfo', classId)
          .catch(err => {
            if (err.response?.data !== 'NFT_CLASS_NOT_FOUND') {
              // eslint-disable-next-line no-console
              console.error(JSON.stringify(err));
            }
          }),
        store
          .dispatch('lazyFetchNFTBookInfoByClassId', classId)
          .catch(error => {
            if (
              error.response?.status !== 400 &&
              error.response?.status !== 404
            ) {
              throw error;
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
    if (this.iscnWorkAuthor) {
      title += ` - ${this.iscnWorkAuthor}`;
    }
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
        this.$i18n.locale !== 'en' ? 'default-zh.jpg' : 'default.jpg'
      }`;
    const schemas = [];
    const iscnOwnerPerson = {
      '@context': 'http://www.schema.org',
      '@type': 'Person',
      url: `${EXTERNAL_HOST}/${this.iscnOwner}`,
      identifier: this.iscnOwner,
    };

    const threeDModel = this.nftModelURL
      ? {
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
        }
      : undefined;
    if (this.purchaseInfo.price) {
      // TODO: check if we can use last purchase price if current price is -1
      const NFTPriceUSD = Math.max(this.NFTPriceUSD, 0);
      schemas.push({
        '@context': 'http://www.schema.org',
        '@type': ['CreativeWork', 'Product'],
        name: title,
        author: this.iscnWorkAuthor,
        image: [ogImage],
        description,
        brand: {
          '@type': 'Brand',
          url: `${EXTERNAL_HOST}/about/writing-nft`,
          name: 'Writing NFT',
        },
        sku: this.classId,
        iscn: this.iscnId,
        isbn: this.iscnData?.contentMetadata?.isbn,
        url: `${EXTERNAL_HOST}${this.$route.path}`,
        offers: {
          '@type': 'Offer',
          seller: iscnOwnerPerson,
          price: NFTPriceUSD,
          priceCurrency: 'USD',
          availability:
            this.NFTPriceUSD >= 0 ? 'LimitedAvailability' : 'OutOfStock',
          checkoutPageURLTemplate: postNewStripeFiatPayment({
            classId: this.classId,
          }),
        },
        subjectOf: threeDModel,
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
          url: 'https://liker.land/about/nft-book',
          name: 'NFT Book',
        },
        author: iscnOwnerPerson,
        sku: this.classId,
        iscn: this.iscnId,
        isbn: this.iscnData?.contentMetadata?.isbn,
        workExample: [],
      };
      this.nftEditions.forEach(e => {
        bookSchema.workExample.push({
          '@type': ['Book', 'Product'],
          name: title,
          image: [ogImage],
          iscn: this.iscnId,
          isbn: this.iscnData?.contentMetadata?.isbn,
          bookEdition: e.name,
          description: e.description,
          brand: {
            '@type': 'Brand',
            url: 'https://liker.land/about/nft-book',
            name: 'NFT Book',
          },
          offers: {
            '@type': 'Offer',
            seller: iscnOwnerPerson,
            price: e.price,
            priceCurrency: 'USD',
            availability: e.stock ? 'LimitedAvailability' : 'OutOfStock',
            checkoutPageURLTemplate: getNFTBookPurchaseLink({
              classId: this.classId,
              priceIndex: e.index,
            }),
          },
          subjectOf: threeDModel,
        });
      });
      schemas.push(bookSchema);
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
    ...mapGetters([
      'getGaClientId',
      'getGaSessionId',
      'getNFTBookStoreBookDefaultPaymentCurrency',
      'getShoppingCartBookProductQuantity',
    ]),
    classId() {
      return this.$route.params.classId;
    },
    platform() {
      return this.$route.query.from || NFT_BOOK_PLATFORM_LIKER_LAND;
    },
    quantity() {
      return this.$route.query.quantity || 1;
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
    defaultCurrency() {
      return this.getNFTBookStoreBookDefaultPaymentCurrency(this.classId);
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
    isShowBanner() {
      return (
        this.classId ===
        'likenft16jguhkfa6nnu224fwjke2zv5f99n8wl9m097h46zqxnyu33j7rgs7f0xg3'
      );
    },
  },
  async mounted() {
    try {
      this.lazyGetUserInfoByAddress(this.iscnOwner);
      this.fetchIscnOwnerNFTDisplayStateList();
      this.updateNFTOwners();
      this.fetchUserCollectedCount();
      if (this.nftClassCollectionType === nftClassCollectionType.NFTBook) {
        this.lazyFetchNFTBookInfoByClassId(this.classId).catch();
        this.fetchRelatedNFTCollection({ type: 'book' });
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

    if (this.hasCrossSell) {
      logTrackerEvent(
        this,
        'NFT',
        this.isEnableCrossSell
          ? 'nft_class_details_cross_sell_enabled'
          : 'nft_class_details_cross_sell_disabled',
        this.classId,
        1
      );
    }
  },
  methods: {
    ...mapActions([
      'addBookProductToShoppingCart',
      'uiPromptSuccessAlert',
      'uiPromptErrorAlert',
    ]),
    parseNFTMetadataURL,
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
    getPurchaseEventParams(edition) {
      const customPriceInDecimal = this.customPrice
        ? this.formatCustomPrice(this.customPrice, edition.price)
        : undefined;
      const totalPrice =
        (customPriceInDecimal || edition.price) * this.quantity;
      return {
        items: [
          {
            name: this.NFTName,
            price: customPriceInDecimal || edition.price,
            classId: this.classId,
            quantity: this.quantity,
          },
        ],
        price: totalPrice,
        currency: 'USD',
        isNFTBook: true,
      };
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
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_click_collect',
        this.classId,
        1
      );

      if (this.nftIsNFTBook) {
        this.checkTippingAvailability(this.defaultSelectedValue);
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
        'nft_class_details_view_content',
        this.classId,
        1
      );
    },
    handleViewContentURL(type) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_view_content_url',
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
        this.classId,
        1
      );
      return this.handleCollect();
    },
    handleGotoCollectFromControlBar() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTGotoCollect(ClassDetailsPageControlBar)',
        this.classId,
        1
      );
      if (this.nftIdCollectNext) {
        this.$router.push(
          this.localeLocation({
            name: 'nft-class-classId-nftId',
            params: { classId: this.classId, nftId: this.nftIdCollectNext },
          })
        );
      } else {
        this.$router.push(
          this.localeLocation({
            name: 'nft-class-classId',
            params: { classId: this.classId },
          })
        );
      }
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
    getEdition(selectedValue) {
      const index = selectedValue ?? this.selectedValue;
      return this.getEditionByIndex(index);
    },
    checkTippingAvailability(selectedValue) {
      this.selectedValue = selectedValue;
      const edition = this.getEdition(selectedValue);
      const hasStock = Boolean(edition?.stock);
      const allowCustomPrice = edition?.isAllowCustomPrice;

      if (!hasStock && !this.nftIsCollectable) return;
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_tipping_check',
        this.classId,
        1
      );
      if (hasStock) {
        if (allowCustomPrice) {
          this.isTippingDialogOpen = true;
          logTrackerEvent(
            this,
            'NFT',
            'nft_class_details_tipping_open',
            this.currentId,
            1
          );
          return;
        }
        if (this.isAddingToCart) {
          this.handleAddToCart(selectedValue);
        } else if (this.shouldCrossSell && edition?.price > 0) {
          this.selectedValue = selectedValue;
          this.openCrossSellDialog();
        } else {
          this.handleCollectFromEdition(selectedValue);
        }
      } else {
        this.uiPromptErrorAlert(
          this.$t('nft_class_details_edition_out_of_stock')
        );
      }
    },
    handleClickAddToCart(selectedValue) {
      if (this.getShoppingCartBookProductQuantity(this.classId)) {
        this.handleAddToCart(selectedValue);
        return;
      }
      this.isAddingToCart = true;
      this.checkTippingAvailability(selectedValue);
    },
    addToCart(selectedValue) {
      const edition = this.getEdition(selectedValue ?? this.selectedValue);
      const hasStock = edition?.stock;

      if (!hasStock && !this.nftIsCollectable) return;
      const customPriceInDecimal = this.customPrice
        ? this.formatCustomPrice(this.customPrice, edition.price)
        : undefined;
      if (edition.price === 0 && !this.customPrice) {
        this.uiPromptErrorAlert(this.$t('cart_item_free_not_supported'));
        return;
      }
      this.addBookProductToShoppingCart({
        classId: this.classId,
        priceIndex: edition.index,
        from: this.platform,
        customPriceInDecimal,
        coupon: this.$route.query.coupon,
      });
      const purchaseEventParams = this.getPurchaseEventParams(edition);
      logPurchaseFlowEvent(this, 'add_to_cart', purchaseEventParams);
      logTrackerEvent(this, 'BookCart', 'class_add_to_cart', this.classId, 1);
    },
    handleAddToCart(selectedValue) {
      this.addToCart(selectedValue);
      this.uiPromptSuccessAlert(this.$t('cart_item_added'));

      if (this.shouldCrossSell) {
        this.isAddingToCart = true;
        this.openCrossSellDialog();
      } else {
        this.isAddingToCart = false;
      }
    },
    async handleCollectFromEdition(selectedValue, giftInfo = undefined) {
      const edition = this.getEdition(selectedValue ?? this.selectedValue);
      const hasStock = edition?.stock;

      if (!hasStock && !this.nftIsCollectable) return;
      if (hasStock) {
        try {
          this.isOpeningCheckoutPage = true;
          const purchaseEventParams = this.getPurchaseEventParams(edition);
          logPurchaseFlowEvent(this, 'add_to_cart', purchaseEventParams);
          logPurchaseFlowEvent(this, 'begin_checkout', purchaseEventParams);
          if (edition.price === 0 && !this.customPrice) {
            this.$router.push(
              this.localeLocation({
                name: 'nft-claim',
                query: {
                  class_id: this.classId,
                  type: 'nft_book',
                  free: true,
                  price_index: edition.index,
                  from: this.platform,
                },
              })
            );
          } else {
            const customPriceInDecimal = this.customPrice
              ? this.formatCustomPrice(this.customPrice, edition.price)
              : undefined;
            const gaClientId = this.getGaClientId;
            const gaSessionId = this.getGaSessionId;
            const link = getNFTBookPurchaseLink({
              classId: this.classId,
              priceIndex: edition.index,
              platform: this.platform,
            });
            const { url } = await this.$axios.$post(link, {
              gaClientId,
              gaSessionId,
              giftInfo,
              coupon: this.$route.query.coupon,
              customPriceInDecimal,
              utmCampaign: this.utmCampaign,
              utmSource: this.utmSource,
              utmMedium: this.utmMedium,
              referrer: this.documentReferrer,
              gadClickId: this.gadClickId,
              gadSource: this.gadSource,
              fbClickId: this.fbClickId,
              email: this.walletEmail,
            });
            if (url) {
              window.location.href = url;
            } else {
              throw new Error('Failed to get purchase link');
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } finally {
          this.isOpeningCheckoutPage = false;
        }
      } else if (this.nftIsCollectable) {
        this.handleGotoCollectFromControlBar();
      }
    },
    formatCustomPrice(customPrice, editionPrice) {
      let newPrice = parseFloat(customPrice);
      if (this.defaultCurrency === 'HKD') {
        newPrice /= USD_TO_HKD_RATIO.toFixed(1);
      }
      return Math.floor((newPrice + editionPrice) * 100);
    },
    handleCollectFromEditionSelector(selectedValue) {
      this.isTriggerFromEditionSelector = true;
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_edition_selector_collect',
        this.classId,
        1
      );
      this.checkTippingAvailability(selectedValue);
    },
    async handleGiftSubmit({ giftInfo }) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_gift_submit',
        this.classId,
        1
      );
      await this.handleCollectFromEdition(this.giftSelectedValue, giftInfo);
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
    handleCollectFromEditionCompareTable(selectedValue) {
      this.isTriggerFromEditionSelector = false;
      logTrackerEvent(
        this,
        'NFT',
        `nft_class_details_edition_compare_table_collect`,
        this.classId,
        1
      );
      this.checkTippingAvailability(selectedValue);
    },
    handleClickCollectionFromEditionCompareTable({ collectionId }) {
      logTrackerEvent(
        this,
        'NFT',
        `nft_class_details_edition_compare_table_go_to_collection`,
        collectionId,
        1
      );
      this.$router.push(
        this.localeLocation({
          name: 'nft-collection-collectionId',
          params: { collectionId },
        })
      );
    },
    async handleEditionSelectChange(selectedValue) {
      this.customPrice = 0;
      await this.$router.replace({
        query: {
          ...this.$route.query,
          price_index: selectedValue,
        },
      });
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_edition_selector_change',
        this.classId,
        1
      );
    },
    handleInputCustomPrice(price) {
      this.customPrice = Number(price);
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
    scrollToEditionCompareSection() {
      this.$nextTick(() =>
        this.$refs.editionCompareSection?.scrollIntoView({ behavior: 'smooth' })
      );
    },
    handleClickEditionCompareButton() {
      this.scrollToEditionCompareSection();
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_compare_button_clicked',
        this.classId,
        1
      );
    },
    handleClickCollectionHint() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_click_collection_hint',
        this.classId,
        1
      );
      this.$nextTick(() =>
        this.$refs.collectionSection?.scrollIntoView({ behavior: 'smooth' })
      );
    },
    handleSubmitTipping(price) {
      this.customPrice = Number(price);
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_tipping_submit',
        this.classId,
        1
      );
      this.isTippingDialogOpen = false;
      if (this.isAddingToCart) {
        this.handleAddToCart();
      } else if (this.shouldCrossSell) {
        this.openCrossSellDialog();
      } else {
        this.handleCollectFromEdition();
      }
    },
    handleSkipTipping() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_tipping_skip',
        this.classId,
        1
      );
      this.customPrice = 0;

      this.isTippingDialogOpen = false;
      if (this.isAddingToCart) {
        this.handleAddToCart();
      } else {
        const edition = this.getEdition(this.selectedValue);
        if (this.shouldCrossSell && edition?.price > 0) {
          this.openCrossSellDialog();
        } else {
          this.handleCollectFromEdition();
        }
      }
    },
    handleClickBookBannerCTA() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_book_banner_cta_clicked',
        this.classId,
        1
      );
    },
    handleCloseTippingDialog() {
      this.isTippingDialogOpen = false;
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_tipping_close',
        this.classId,
        1
      );
    },
    handleGiftClose() {
      this.isGiftDialogOpen = false;
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_gift_close',
        this.classId,
        1
      );
    },
    handleCrossSellAccept() {
      this.closeCrossSellDialog();
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_cross_sell_accept',
        this.classId,
        1
      );
      if (this.isAddingToCart) {
        this.isAddingToCart = false;
      } else {
        this.addToCart();
        this.$router.push(this.localeLocation({ name: 'shopping-cart-book' }));
      }
    },
    handleCrossSellReject() {
      this.closeCrossSellDialog();
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_cross_sell_reject',
        this.classId,
        1
      );

      if (this.isAddingToCart) {
        this.isAddingToCart = false;
      } else {
        this.handleCollectFromEdition();
      }
    },
    handleSignatureBannerClick() {
      this.scrollToEditionCompareSection();
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_sign_banner_click',
        this.classId,
        1
      );
    },
    handleSignatureBannerScrollToBottom() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_sign_banner_scroll',
        this.classId,
        1
      );
    },
  },
};
</script>
