<template>
  <Page class="relative overflow-x-hidden">
    <CardV2 v-if="isLoading" class="absolute top-[40%]">{{
      $t('nft_details_page_label_loading')
    }}</CardV2>
    <div v-else class="px-[12px] laptop:px-[24px] pb-[120px] w-full">
      <div class="flex flex-col gap-[24px] w-full max-w-[962px] mx-auto">
        <a
          v-if="nftShouldShowEventBanner"
          :class="[
            'phone:relative fixed',
            'sm:z-[60]',
            'sm:left-[30px]',
            'sm:bottom-[30px]',

            'sm:w-[240px] sm:hover:w-[300px]',
            'sm:h-[240px] sm:hover:h-[300px]',
            'sm:hover:rotate-[-3deg]',

            'transition-all',
            'duration-500',
          ]"
          :href="nftEventBanner?.href"
          target="_blank"
          rel="noopener"
          @click="handleClickEventBanner"
        >
          <button
            :class="[
              'absolute',
              'top-[28px]',
              'right-[12px]',

              'phone:hidden flex',
              'items-center',
              'justify-center',

              'w-[30px]',
              'h-[30px]',

              'bg-white',
              'bg-opacity-[0.1] hover:bg-opacity-25',
              'rounded-full',

              'transition-all',
            ]"
            @click.prevent="handleClickEventBannerCloseButton"
          >
            <IconClose class="w-[16px] h-[16px] text-white" />
          </button>

          <picture>
            <source
              :srcset="nftEventBanner?.imgSrc"
              media="(min-width: 528px)"
            />
            <source :srcset="nftEventBanner?.imgSrcForMobile" />
            <img
              :src="nftEventBanner?.imgSrcForMobile"
              :alt="nftEventBanner?.imgAlt"
            />
          </picture>
        </a>

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
          :nft-image-url="nftImageUrl"
          :creator-message="creatorMessage"
          :class-owner="classOwner"
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
            :author-query="nftAuthorQueryOverride"
            :is-owner-hidden="nftIsOwnerHidden"
            @click-avatar="handleNFTCardClickAvatar"
            @clickTooltip="handleNFTCardClickTooltip"
            @expand="handleBookInfoExpand"
          >
            <template #column-left>
              <ul
                :class="[
                  'flex',
                  'justify-center',
                  'items-center',
                  'gap-[16px]',

                  'text-medium-gray',
                  'text-[12px]',
                ]"
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

              <div class="flex flex-col gap-[8px] w-full">
                <ButtonV2
                  preset="outline"
                  :class="[
                    'w-full',
                    '!h-[32px]',
                    '!rounded-[10px]',
                    'border-[#EBEBEB]',
                  ]"
                  size="tiny"
                  @click="handleShareButtonClick"
                >
                  <IconShare class="w-[16px] text-dark-gray" />
                  <p
                    class="ml-[8px] text-[12px] text-dark-gray"
                    v-text="$t('nft_details_page_button_share')"
                  />
                </ButtonV2>

                <ButtonV2
                  preset="outline"
                  :class="[
                    'w-full',
                    '!h-[32px]',
                    '!rounded-[10px]',
                    'border-[#EBEBEB]',
                    { 'opacity-50': isGiftingDisabled },
                  ]"
                  size="tiny"
                  :is-disabled="isGiftingDisabled"
                  @click="handleGiftButtonClick"
                >
                  <IconGift class="w-[16px] text-dark-gray" />
                  <p
                    class="ml-[8px] text-[12px] text-dark-gray"
                    v-text="$t('nft_edition_select_confirm_button_text_gift')"
                  />
                </ButtonV2>

                <ButtonV2
                  v-if="!isAllSoldOut"
                  preset="outline"
                  size="tiny"
                  class="w-full !h-[32px] !rounded-[10px] border-[#EBEBEB]"
                  content-class="text-[12px] text-dark-gray"
                  :text="compareButtonText"
                  @click="handleClickEditionCompareButton"
                />
              </div>

              <NFTViewOptionList
                :class-id="classId"
                :nft-id="nftIdCollectedFirstByUser"
                :content-urls="normalizedClassContentURLs"
                :external-url="externalUrl"
                :is-nft-book="nftIsNFTBook"
                :is-content-viewable="isContentViewable"
                :is-content-downloadable="!nftIsDownloadHidden"
                :should-show-content-url-buttons="false"
                @view-content="handleViewContent"
                @view-content-url="handleViewContentURL"
              />
            </template>

            <template #column-edition-select>
              <div
                class="hidden laptop:block border-b-[1px] border-[#EBEBEB] w-full my-[16px]"
              />
              <div
                v-if="nftCollections.length"
                class="items-center justify-end w-full mt-[12px]"
                @click="handleClickCollectionHint"
              >
                <Label
                  class="underline relative text-medium-gray !text-[12px] mb-[-20px] z-50 cursor-pointer"
                  align="right"
                  :text="$t('nft_collection_hint')"
                >
                  <template #append>
                    <IconCollection />
                  </template>
                </Label>
              </div>
              <NFTEditionSelect
                class="self-stretch"
                :items="nftEditions"
                :should-show-notify-button="false"
                :value="selectedValue"
                :is-all-sold-out="isAllSoldOut"
                @change="handleEditionSelectChange"
                @click-collect="handleCollectFromEditionSelector"
                @click-add-to-cart="handleClickAddToCart"
                @input-custom-price="handleInputCustomPrice"
              />
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

          <client-only>
            <lazy-component
              class="pointer-events-none"
              @show.once="fetchTrimmedCollectorsInfo"
            />
          </client-only>
          <section
            v-if="shouldShowCollectorMessage"
            :class="[
              'relative',
              isHistoryInfoLoading ? 'py-[32px]' : 'pt-[48px] pb-[96px]',
            ]"
          >
            <div
              v-if="isHistoryInfoLoading"
              class="flex items-center justify-center w-full"
            >
              <ProgressIndicator preset="thin" />
            </div>
            <template v-else>
              <div
                class="flex items-center justify-between mb-[24px] px-[16px] laptop:px-0 sm:px-[32px]"
              >
                <h3
                  class="text-[28px] font-600 text-center text-like-green"
                  v-text="$t('nft_collector_message_label')"
                />
                <ButtonV2
                  preset="tertiary"
                  size="mini"
                  :text="$t('nft_collector_message_view_all')"
                  @click="handleClickMoreCollectorMessage"
                />
              </div>
              <NFTPageCollectorMessageList
                class="transform -translate-x-1/2 w-[100vw] left-1/2"
                :class-id="classId"
                :creator-avatar="creatorAvatar"
                :messages="filterCollectorsWithReplies"
                :scroll-speed="7.5"
              />
              <div
                :class="[
                  'relative',
                  'flex',
                  'justify-between',
                  'h-[180px] laptop:h-[204px]',
                  'z-50',
                  '-mx-[12px] laptop:-mx-[24px] desktop:-mx-[calc((100vw-962px)/2)]',
                  '-mt-[180px] laptop:-mt-[204px]',
                  'pointer-events-none',
                ]"
              >
                <div :class="[overlayClasses, 'bg-gradient-to-r']" />
                <div :class="[overlayClasses, 'bg-gradient-to-l']" />
              </div>
            </template>
          </section>

          <NFTBookSignatureBanner
            v-if="nftHasSignImage"
            tag="section"
            :name="nftSignImageAuthor"
            @click="handleSignatureBannerClick"
            @scroll-to-bottom="handleSignatureBannerScrollToBottom"
          />

          <!-- recommend -->
          <NFTPageRecommendation
            :class-id="classId"
            :override-class-ids="nftRecommendedClassIdsOverride"
            @header-avatar-click="handleRecommendationHeaderAvatarClick"
            @follow-button-click="handleFollowButtonClick"
            @item-click="handleRecommendedItemClick"
            @item-collect="handleRecommendedItemCollect"
            @slide-next.once="handleRecommendationSlideNext"
            @slide-prev.once="handleRecommendationSlidePrev"
            @slider-move.once="handleRecommendationSliderMove"
          />

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
                  :src="nftImageUrl"
                  :edition-config="editionConfig"
                  @click-collect="handleCollectFromEditionCompareTable"
                />
              </li>
            </ul>
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
            <NFTPagePreviewCard
              :url="externalUrl"
              :content-urls="normalizedClassContentURLs"
              :image-bg-color="nftImageBackgroundColor"
              :image-url="nftImageUrl"
              :animation-url="nftAnimationUrl"
              :avatar-url="creatorAvatar"
              :avatar-size="40"
              :is-avatar-outlined="isCreatorCivicLiker"
              :is-nft-book="nftIsNFTBook"
              :class-owner="classOwner"
              :class-author-name="classAuthorName"
              :external-url="externalUrl"
              :display-name="creatorDisplayNameFull"
              :class-id="classId"
              :nft-id="nftIdCollectedFirstByUser"
              :nft-name="nftName"
              :nft-description="nftDescription"
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
            :content-fingerprints="classContentFingerprints"
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
          </ul>
        </section>
      </div>
    </div>
    <NFTBookGiftDialog
      :open="isGiftDialogOpen"
      :items="nftEditions"
      :value="selectedValue"
      @change="handleEditionSelectChange"
      @submit="handleGiftSubmit"
      @close="handleGiftClose"
    />
    <NFTBookTippingDialog
      :open="isTippingDialogOpen"
      :creator-avatar="creatorAvatar"
      :display-name="creatorDisplayNameFull"
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
      :title="nftPageOverride?.crossSellDialogTitle"
      @accept="handleCrossSellAccept"
      @reject="handleCrossSellReject"
    />

    <Bodhisattva18BannerCTA
      v-if="isShowBanner"
      class="w-full"
      @click-button="handleClickBookBannerCTA"
    />

    <NFTPageCollectorListDialog
      :is-open-dialog="isOpeningCollectorListDialog"
      :class-id="classId"
      :items="populatedBuyerWithMessage"
      @close="isOpeningCollectorListDialog = false"
    />
    <MigrateNoticeModalPurchase
      :is-open="isMigrateNoticeModalOpen"
      @close="handleCloseMigrateNoticeModal"
    />
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  IS_TESTNET,
  EXTERNAL_HOST,
  NFT_BOOK_PLATFORM_LIKER_LAND,
  LIKECOIN_API_BASE,
  LIKECOIN_BUTTON_BASE,
  BOOK3_HOSTNAME,
  IS_MIGRATION_STARTED,
} from '@/constant/index';
import { nftClassCollectionType, parseNFTMetadataURL } from '~/util/nft';
import { getNFTBookPurchaseLink, postNewStripeFiatPayment } from '~/util/api';
import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';

import nftMixin from '~/mixins/nft';
import clipboardMixin from '~/mixins/clipboard';
import crossSellMixin from '~/mixins/cross-sell';
import navigationListenerMixin from '~/mixins/navigation-listener';
import utmMixin from '~/mixins/utm';
import alertMixin from '~/mixins/alert';
import couponMixin from '~/mixins/coupon';

export default {
  name: 'NFTClassDetailsPage',
  mixins: [
    clipboardMixin,
    crossSellMixin,
    nftMixin,
    navigationListenerMixin,
    utmMixin,
    alertMixin,
    couponMixin,
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

      trimmedCount: 10,

      customPrice: 0,
      isOpeningCheckoutPage: false,

      isHistoryInfoLoading: false,
      hasHistoryInfoLoaded: false,
      isOpeningCollectorListDialog: false,

      isMigrateNoticeModalOpen: false,
    };
  },
  async fetch({
    route,
    store,
    redirect,
    error,
    localeLocation,
    $redirectTo3ookByNFTClassId,
  }) {
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
    if (classId.startsWith('0x')) {
      $redirectTo3ookByNFTClassId(301, classId);
      return;
    }
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
    const storeInfo = store.getters.getNFTBookStoreInfoByClassId(classId);
    if (storeInfo?.evmClassId) {
      // redirect to evm class page if exists
      $redirectTo3ookByNFTClassId(301, storeInfo.evmClassId);
    }
  },
  head() {
    let title = this.nftName || this.$t('nft_details_page_title');
    if (this.classAuthorName) {
      title += ` - ${this.classAuthorName}`;
    }
    if (this.nftIsNFTBook) {
      title += ` - ${this.$t('nft_details_page_title_book')}`;
    } else if (!title.includes(this.$t('nft_details_page_title_article'))) {
      title += ` - ${this.$t('nft_details_page_title_article')}`;
    }
    const description =
      this.nftDescription || this.$t('nft_details_page_description');
    const ogImage =
      this.nftImageUrl ||
      `${EXTERNAL_HOST}/images/og/${
        this.$i18n.locale !== 'en' ? 'default-zh.jpg' : 'default.jpg'
      }`;
    const schemas = [];
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
        hid: 'og:url',
        property: 'og:url',
        content: `${EXTERNAL_HOST}${this.$route.path}`,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: ogImage,
      },
      {
        hid: 'likecoin:wallet',
        name: 'likecoin:wallet',
        content: this.classOwner,
      },
    ];
    const classOwnerPerson = {
      '@context': 'http://www.schema.org',
      '@type': 'Person',
      url: `${EXTERNAL_HOST}/${this.classOwner}`,
      identifier: this.classOwner,
    };

    const threeDModel = this.nftModelURL
      ? {
          '@context': 'http://schema.org/',
          '@type': '3DModel',
          image: ogImage,
          name: title,
          encoding: [
            {
              '@context': 'http://www.schema.org',
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
        author: this.classAuthor || this.classOwnerPerson,
        image: [ogImage],
        description,
        brand: {
          '@context': 'http://www.schema.org',
          '@type': 'Brand',
          url: `${EXTERNAL_HOST}/about/writing-nft`,
          name: 'Writing NFT',
        },
        sku: this.classId,
        isbn: this.contentMetadata.isbn,
        datePublished:
          this.contentMetadata.datePublished ||
          this.contentMetadata.recordTimestamp,
        url: `${EXTERNAL_HOST}${this.$route.path}`,
        offers: {
          '@context': 'http://www.schema.org',
          '@type': 'Offer',
          seller: classOwnerPerson,
          price: NFTPriceUSD,
          priceCurrency: 'USD',
          availability:
            this.NFTPriceUSD >= 0 ? 'LimitedAvailability' : 'OutOfStock',
          checkoutPageURLTemplate: postNewStripeFiatPayment({
            classId: this.classId,
          }),
        },
        subjectOf: threeDModel,
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            propertyID: 'iscn',
            value: this.iscnId,
          },
        ],
      });
    }
    if (this.nftIsNFTBook && this.nftEditions) {
      const bookSchema = {
        '@context': 'https://schema.org',
        '@type': ['Book', 'ProductGroup'],
        url: `${EXTERNAL_HOST}${this.$route.path}`,
        name: title,
        image: [ogImage],
        description,
        brand: {
          '@context': 'http://www.schema.org',
          '@type': 'Brand',
          url: 'https://liker.land/about/nft-book',
          name: 'NFT Book',
        },
        author: this.classAuthor || classOwnerPerson,
        sku: this.classId,
        publisher: this.classPublisher || classOwnerPerson,
        isbn: this.contentMetadata.isbn,
        inLanguage: this.contentMetadata.inLanguage,
        productGroupID: this.classId,
        datePublished: this.contentMetadata.recordTimestamp,
        bookFormat: 'https://schema.org/EBook',
        workExample: [],
        hasVariant: [],
        variesBy: ['https://schema.org/BookEdition'],

        additionalProperty: [
          {
            '@type': 'PropertyValue',
            propertyID: 'iscn',
            value: this.iscnId,
          },
        ],
      };
      this.nftEditions.forEach(e => {
        schemas.push({
          '@context': 'http://www.schema.org',
          '@type': ['Book', 'Product'],
          '@id': `@${this.classId}-${e.index}`,
          url: `${EXTERNAL_HOST}${this.$route.path}?price_index=${e.index}`,
          productID: `${this.classId}-${e.index}`,
          name: `${title} - ${e.name}`,
          image: [ogImage],
          sku: `${this.classId}-${e.index}`,
          inProductGroupWithID: this.classId,
          isbn: this.contentMetadata.isbn,
          inLanguage: this.contentMetadata.inLanguage,
          bookFormat: 'https://schema.org/EBook',
          bookEdition: e.name,
          description: `${e.description}\n${description}`,
          brand: {
            '@context': 'http://www.schema.org',
            '@type': 'Brand',
            url: 'https://liker.land/about/nft-book',
            name: 'NFT Book',
          },
          offers: {
            '@context': 'http://www.schema.org',
            '@type': 'Offer',
            seller: classOwnerPerson,
            price: e.price,
            priceCurrency: 'USD',
            availability: e.stock ? 'LimitedAvailability' : 'OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            checkoutPageURLTemplate: getNFTBookPurchaseLink({
              classId: this.classId,
              priceIndex: e.index,
            }),
          },
          subjectOf: threeDModel,
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              propertyID: 'iscn',
              value: this.iscnId,
            },
          ],
        });
        bookSchema.workExample.push({
          '@id': `@${this.classId}-${e.index}`,
        });
        bookSchema.hasVariant.push({
          '@id': `@${this.classId}-${e.index}`,
        });
      });
      schemas.push(bookSchema);
      // disable og product for testnet to avoid pixel auto fetch
      if (!IS_TESTNET && this.nftEdition && !this.isNFTHidden) {
        const e = this.nftEdition;
        [
          {
            hid: 'og:price:amount',
            property: 'og:price:amount',
            content: e.price,
          },
          {
            hid: 'product:price:amount',
            property: 'product:price:amount',
            content: e.price,
          },
          {
            hid: 'og:price:currency',
            property: 'og:price:currency',
            content: 'USD',
          },
          {
            hid: 'product:price:currency',
            property: 'product:price:currency',
            content: 'USD',
          },
          {
            hid: 'og:availability',
            property: 'og:availability',
            content: e.stock ? 'in stock' : 'out of stock',
          },
          {
            hid: 'product:brand',
            property: 'product:brand',
            content: 'NFT Book',
          },
          {
            hide: 'product:locale',
            property: 'product:locale',
            content: this.$i18n.locale,
          },
          {
            hid: 'product:catalog_id',
            property: 'product:catalog_id',
            content: `${this.classId}-${e.index}`,
          },
          {
            hid: 'product:retailer_item_id',
            property: 'product:retailer_item_id',
            content: `${this.classId}-${e.index}`,
          },
          {
            hid: 'product:category',
            property: 'product:category',
            content: 543542,
          },
          {
            hid: 'product:condition',
            property: 'product:condition',
            content: 'new',
          },
          {
            hid: 'product:custom_label_0',
            property: 'product:custom_label_0',
            content: this.classOwner,
          },
        ].forEach(m => meta.push(m));
        meta.find(m => m.hid === 'og:url').content = `${EXTERNAL_HOST}${
          this.$route.path
        }?price_index=${e.index}`;
        if (e.name) {
          let titleWithEdition =
            this.nftName || this.$t('nft_details_page_title');
          titleWithEdition += ` - ${e.name}`;
          if (this.classAuthorName) {
            titleWithEdition += ` - ${this.classAuthorName}`;
          }
          meta.find(m => m.hid === 'og:title').content = titleWithEdition;
        }
        if (this.contentMetadata.isbn) {
          meta.push({
            hid: 'product:isbn',
            property: 'product:isbn',
            content: this.contentMetadata.isbn,
          });
        }
        if (this.classAuthorName) {
          meta.push({
            hid: 'product:custom_label_1',
            property: 'product:custom_label_1',
            content: this.classAuthorName,
          });
        }
        if (this.contentMetadata.inLanguage) {
          meta.push({
            hid: 'product:custom_label_2',
            property: 'product:custom_label_2',
            content: this.contentMetadata.inLanguage,
          });
        }
      }
    }
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
      'getShoppingCartBookProductQuantity',
      'getNFTBookStoreInfoByClassId',
    ]),
    classId() {
      return this.$route.params.classId;
    },
    selectedValue: {
      get() {
        return Number(this.$route.query.price_index) || 0;
      },
      set(value) {
        if (this.$route.query.price_index !== value) {
          this.$router.replace({
            query: { ...this.$route.query, price_index: value },
          });
        }
      },
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
      return this.walletFollowees?.includes(this.classOwner) || false;
    },
    isContentViewable() {
      return !(this.nftIsNFTBook && !this.ownCount);
    },
    shouldShowFollowButton() {
      return Boolean(this.classOwner !== this.getAddress);
    },
    // for WNFT
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
    // for collector dialog
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
    // for collector message list
    filterCollectorsWithReplies() {
      if (!this.populatedDisplayEvents || !this.populatedCollectors) {
        return [];
      }
      const collectorsWithReplies = this.populatedCollectors
        .map(collector => {
          const purchaseEvent = this.populatedDisplayEvents.find(
            event =>
              event.event === 'purchase' && event.toWallet === collector.id
          );

          const transferEvent = this.populatedDisplayEvents.find(
            event =>
              event.event === 'transfer' && event.toWallet === collector.id
          );

          let buyerMessage = null;
          let authorReply = null;

          if (purchaseEvent) {
            buyerMessage = purchaseEvent.buyerMessage || null;
          } else if (transferEvent) {
            buyerMessage = transferEvent.buyerMessage || null;
            authorReply = transferEvent.memo || null;
          }

          if (!buyerMessage) {
            return null;
          }

          return {
            ...collector,
            buyerMessage,
            authorReply,
          };
        })
        .filter(Boolean);

      if (collectorsWithReplies && collectorsWithReplies.length) {
        collectorsWithReplies.sort((a, b) => {
          if (a.buyerMessage && !b.buyerMessage) {
            return -1;
          }
          if (!a.buyerMessage && b.buyerMessage) {
            return 1;
          }
          return 0;
        });
      }

      return collectorsWithReplies;
    },
    shouldShowCollectorMessage() {
      return this.filterCollectorsWithReplies?.length > 3;
    },
    isShowBanner() {
      return (
        this.classId ===
        'likenft16jguhkfa6nnu224fwjke2zv5f99n8wl9m097h46zqxnyu33j7rgs7f0xg3'
      );
    },
    isAllSoldOut() {
      return this.nftEditions.every(
        item => item.stock === 0 || item.priceLabel === undefined
      );
    },
    isGiftingDisabled() {
      return (
        this.isAllSoldOut ||
        this.nftEditions.find(item => item.value === this.selectedValue)
          ?.isPhysicalOnly
      );
    },
    compareButtonText() {
      return this.$t(
        this.nftEditions?.length === 1
          ? 'nft_edition_view_edition_button_text'
          : 'nft_edition_select_compare_button_text'
      );
    },
    overlayClasses() {
      return [
        'h-full',
        'w-[60px]',
        'from-light-gray',
        'to-transparent',
        'hidden',
        'laptop:block',
      ];
    },
  },
  async mounted() {
    try {
      this.lazyGetUserInfoByAddress(this.classOwner);
      this.fetchIscnOwnerNFTDisplayStateList();
      this.lazyFetchNFTOwners();
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
            name: this.nftName,
            classId: this.classId,
            priceIndex: this.editionPriceIndex,
            price: this.NFTPriceUSD,
          },
        ],
        price: this.NFTPriceUSD,
        currency: 'USD',
        isNFTBook: this.nftIsNFTBook,
      });
    }

    if (this.hasCrossSell) {
      logTrackerEvent(
        this,
        'NFT',
        this.isCrossSellEnabled
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
      this.isHistoryInfoLoading = true;
      const trimmedCollectors = this.sortedOwnerListId.slice(
        0,
        this.trimmedCount
      );
      await Promise.all([
        this.lazyGetUserInfoByAddresses(trimmedCollectors),
        this.updateNFTHistory({ getAllUserInfo: false }),
      ]);
      this.isHistoryInfoLoading = false;
      this.hasHistoryInfoLoaded = true;
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
            name: this.nftName,
            price: customPriceInDecimal || edition.price,
            classId: this.classId,
            priceIndex: edition.index,
            quantity: this.quantity,
          },
        ],
        price: totalPrice,
        currency: 'USD',
        isNFTBook: this.nftIsNFTBook,
      };
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
    async handleClickMoreCollectorMessage() {
      this.isOpeningCollectorListDialog = true;
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

      if (IS_MIGRATION_STARTED) {
        this.isMigrateNoticeModalOpen = true;
        return;
      }

      if (this.nftIsNFTBook) {
        this.checkTippingAvailability(this.selectedValue);
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
      if (IS_MIGRATION_STARTED) {
        this.isMigrateNoticeModalOpen = true;
        return;
      }
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
        const edition = this.getEdition(selectedValue);
        if (this.isAddingToCart) {
          this.handleAddToCart(selectedValue);
        } else if (
          this.shouldCrossSell ||
          (this.hasCrossSell && edition.price === 0)
        ) {
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

      const edition = this.getEdition(selectedValue);
      if (this.shouldCrossSell || (this.hasCrossSell && edition.price === 0)) {
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
          const { url, paymentId } = await this.$axios.$post(
            link,
            {
              gaClientId,
              gaSessionId,
              giftInfo,
              coupon: this.getApplicableCoupon({
                checkoutPrice: edition.price,
              }),
              customPriceInDecimal,
              utmCampaign: this.utmCampaign,
              utmSource: this.utmSource,
              utmMedium: this.utmMedium,
              referrer: this.documentReferrer,
              gadClickId: this.gadClickId,
              gadSource: this.gadSource,
              fbClickId: this.fbClickId,
              email: this.walletEmail,
            },
            {
              headers: {
                Authorization: this.getAccessToken
                  ? `Bearer ${this.getAccessToken}`
                  : undefined,
              },
            }
          );
          logPurchaseFlowEvent(this, 'begin_checkout', {
            ...purchaseEventParams,
            paymentId,
          });
          if (url) {
            window.location.href = url;
          } else {
            throw new Error('Failed to get purchase link');
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
      const newPrice = parseFloat(customPrice);
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
    async handleGiftSubmit({ giftInfo, selectedValue }) {
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
    handleShareButtonClick() {
      this.shareURLPath({
        title: this.nftName,
        path: this.nftClassDetailsPageSharePath,
        alertMessage: this.$t('tooltip_share_done'),
      });
      logTrackerEvent(this, 'NFT', 'share', this.classId, 1, {
        content_type: 'nft',
        item_id: `${this.classId}-${this.editionPriceIndex}`,
      });
    },
    handleGiftButtonClick() {
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
    handleEditionSelectChange(selectedValue) {
      this.customPrice = 0;
      this.selectedValue = selectedValue;
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_edition_selector_change',
        this.classId,
        1
      );
      logPurchaseFlowEvent(this, 'view_item', {
        items: [
          {
            name: this.nftName,
            classId: this.classId,
            priceIndex: this.editionPriceIndex,
            price: this.NFTPriceUSD,
          },
        ],
        price: this.NFTPriceUSD,
        currency: 'USD',
        isNFTBook: this.nftIsNFTBook,
      });
    },
    handleInputCustomPrice(price) {
      this.customPrice = Number(price);
    },
    async handleFollowButtonClick() {
      await this.handleClickFollow({
        followOwner: this.classOwner,
      });
      this.alertPromptSuccess(
        this.$t('portfolio_subscription_success_alert', {
          creator: this.getUserInfoByAddress(this.classOwner)?.displayName,
        })
      );
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
      const edition = this.getEdition(this.selectedValue);
      if (this.isAddingToCart) {
        this.handleAddToCart();
      } else if (
        this.shouldCrossSell ||
        (this.hasCrossSell && edition.price === 0)
      ) {
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
        if (
          this.shouldCrossSell ||
          (this.hasCrossSell && edition.price === 0)
        ) {
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
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_tipping_close',
        this.classId,
        1
      );
      this.customPrice = 0;

      this.isTippingDialogOpen = false;
      if (this.isAddingToCart) {
        this.handleAddToCart();
      } else {
        const edition = this.getEdition(this.selectedValue);
        if (
          this.shouldCrossSell ||
          (this.hasCrossSell && edition.price === 0)
        ) {
          this.openCrossSellDialog();
        } else {
          this.handleCollectFromEdition();
        }
      }
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
    handleNFTCardClickTooltip() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_card_tooltip_clicked',
        this.classId,
        1
      );
    },
    handleBookInfoExpand() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_book_info_expand',
        this.classId,
        1
      );
    },
    handleCloseMigrateNoticeModal() {
      this.isMigrateNoticeModalOpen = false;
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_migrate_notice_close',
        this.classId,
        1
      );
    },
  },
};
</script>
