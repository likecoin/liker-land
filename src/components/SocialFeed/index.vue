<template>
  <div :class="['w-full', 'flex', 'flex-col', 'items-stretch', 'gap-[3rem]']">
    <template v-if="shouldShowLoading">
      <SocialFeedPlaceholder />
    </template>
    <ul v-if="displayedEvents.length" class="flex flex-col w-full gap-[48px]">
      <li v-for="e in displayedEvents" :key="e.tx_hash">
        <client-only>
          <lazy-component @show.once="fetchInfo({ event: e })" />
        </client-only>
        <SocialFeedItem
          :type="e.type"
          :sender-address="e.sender"
          :receiver-address="e.receiver"
          :memo="getFeedEventMemo(e.key)"
          :timestamp="e.timestamp"
          :class-id="e.class_id"
          :nft-id="e.nft_id"
          :batch-send-list="e.batchSendList"
          @sender-click="handleClickFeedSender"
          @receiver-click="handleClickFeedReceiver"
          @follow="handleFollowFeed"
          @nft-title-click="handleClickFeedNFTTitle"
          @nft-click="handleClickFeedNFT"
          @nft-collect="handleCollectFeedNFT"
        />
      </li>
    </ul>
    <template v-if="shouldShowMore">
      <div v-if="!isFetchingEventsWithMemo" class="py-[128px] text-gray-9b">
        <client-only>
          <lazy-component @show.once="handleInfiniteScrollFeed" />
        </client-only>
      </div>
      <SocialFeedPlaceholder v-if="isFetchingEventsWithMemo" />
    </template>
    <template v-if="shouldShowEnd">
      <hr class="w-[32px] h-[2px] bg-shade-gray border-none" />
      <div class="flex justify-center font-[600] py-[24px] text-gray-9b">
        {{ $t('feed_end_of_items') }}
      </div>
    </template>
    <CardV2
      v-if="shouldShowEmpty"
      class="flex flex-col justify-center items-center gap-[1rem] w-full min-h-[25vh]"
      :is-outline="true"
    >
      <i18n
        class="text-[0.9em] text-medium-gray text-center p-[3rem]"
        path="feed_empty_description"
      >
        <NuxtLink
          class="underline text-like-green hover:text-like-green-dark"
          :to="localeLocation({ name: 'store' })"
          place="action"
          @click.native="handleEmptyFeedActionClick"
          >{{ $t('feed_empty_action') }}</NuxtLink
        >
      </i18n>
    </CardV2>
    <CardV2
      v-if="shouldShowEmpty || shouldShowEnd"
      class="flex flex-col justify-center items-center gap-[1rem] w-full min-h-[25vh]"
      :is-outline="true"
    >
      suggest follow
    </CardV2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ellipsisNFTName } from '~/util/ui';

export default {
  name: 'SocialFeed',
  filters: {
    ellipsisNFTName,
  },
  props: {
    shouldShowLoading: {
      type: Boolean,
      default: false,
    },
    shouldShowMore: {
      type: Boolean,
      default: false,
    },
    shouldShowEnd: {
      type: Boolean,
      default: false,
    },
    shouldShowEmpty: {
      type: Boolean,
      default: false,
    },
    isFetchingEventsWithMemo: {
      type: Boolean,
      default: false,
    },
    displayedEvents: {
      type: Array,
      default: undefined,
    },
  },
  computed: {
    ...mapGetters(['getFeedEventMemo']),
  },

  methods: {
    fetchInfo({ event }) {
      this.$emit('on-fetch-info', { event });
    },
    handleInfiniteScrollFeed() {
      this.$emit('on-scroll-feed');
    },
    handleEmptyFeedActionClick() {
      this.$emit('on-click-feed');
    },
    handleClickFeedSender() {
      this.$emit('sender-click');
    },
    handleClickFeedReceiver() {
      this.$emit('receiver-click');
    },
    handleFollowFeed() {
      this.$emit('follow');
    },
    handleClickFeedNFTTitle() {
      this.$emit('nft-title-click');
    },
    handleClickFeedNFT() {
      this.$emit('nft-click');
    },
    handleCollectFeedNFT() {
      this.$emit('nft-collect');
    },
  },
};
</script>
