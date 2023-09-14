<template>
  <div :class="['w-full','max-w-[500px]', 'flex', 'flex-col', 'items-center', 'gap-[3rem]']">
    <template v-if="shouldShowLoading">
      <SocialFeedPlaceholder />
    </template>
    <ul v-if="displayedEvents.length" class="flex flex-col items-center w-full gap-[48px]">
      <li v-for="e in displayedEvents" :key="e.tx_hash" class="w-full">
        <client-only>
          <lazy-component @show.once="handleFetchEventInfo({ event: e })" />
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
      class="relative flex flex-col justify-center items-center gap-[1rem] w-full min-h-[25vh]"
      :is-outline="true"
    >
      <div class="flex justify-center font-[600] py-[12px] text-gray-9b">
        {{ suggestionText }}
      </div>
      <ul class="flex flex-col gap-[16px] w-full">
        <li
          v-for="{ address, avatar, displayName } in suggestedFollowList"
          :key="address"
          class="flex items-center justify-between w-full bg-white p-[16px] rounded-[48px]"
        >
          <NuxtLink
            class="flex items-center justify-center gap-[8px] text-like-green group"
            :to="
              address
                ? localeLocation({ name: 'id', params: { id: address } })
                : ''"
            target="_blank"
            @click.native="$emit('suggested-click', address)"
          >
            <Identity
              class="self-start flex-shrink-0"
              :avatar-url="avatar"
              :avatar-size="42"
              :is-avatar-outlined="false"
            />
            <Label class="text-like-green ml-[4px] text-[16px] font-600">{{
              displayName | ellipsis
            }}</Label>
          </NuxtLink>
          <div>
            <ButtonV2
              class="min-w-[138px] rounded-full"
              :text="$t('settings_follow_follow')"
              preset="tertiary"
              @click="() => clickFollow(address)"
            />
          </div>
        </li>
      </ul>
    </CardV2>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ellipsisNFTName, ellipsis } from '~/util/ui';
import alertMixin from '~/mixins/alert';

export default {
  name: 'SocialFeed',
  filters: {
    ellipsisNFTName,
    ellipsis,
  },
  mixins: [alertMixin],
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
    ...mapGetters([
      'getFeedEventMemo',
      'getSuggestedFollowList',
      'getUserInfoByAddress',
    ]),
    suggestedFollowList() {
      return this.getSuggestedFollowList.map(address => ({
        address,
        avatar: this.getUserInfoByAddress(address)?.avatar,
        displayName: this.getUserInfoByAddress(address)?.displayName || address,
      }));
    },
    suggestionText() {
      return this.shouldShowEmpty
        ? this.$t('feed_suggest_to_follow_for_empty')
        : this.$t('feed_suggest_to_follow');
    },
  },
  mounted() {
    this.fetchSuggestedUserInfo();
  },
  methods: {
    ...mapActions([
      'walletFollowCreator',
      'fetchSuggestedFollowList',
      'lazyGetUserInfoByAddresses',
    ]),
    async clickFollow(wallet) {
      try {
        this.$emit('on-click-suggested-follow', wallet);
        await this.walletFollowCreator(wallet);
        this.alertPromptSuccess(
          this.$t('portfolio_subscription_success_alert', {
            creator: wallet,
          })
        );
        await this.fetchSuggestedFollowList();
        this.fetchSuggestedUserInfo();
      } catch (error) {
        this.alertPromptError(error.toString());
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    fetchSuggestedUserInfo() {
      this.lazyGetUserInfoByAddresses(this.getSuggestedFollowList);
    },
    handleFetchSuggestedUserInfo() {
      this.$emit('on-fetch-suggested-user-info');
    },
    handleFetchEventInfo({ event }) {
      this.$emit('on-fetch-event-info', { event });
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
    async handleFollowFeed() {
      this.$emit('on-click-feed-follow');
      await this.fetchSuggestedFollowList();
      this.fetchSuggestedUserInfo();
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
