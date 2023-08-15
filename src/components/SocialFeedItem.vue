<template>
  <div class="flex flex-col justify-start gap-[12px]">
    <client-only>
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>

    <div class="flex items-center justify-between">
      <NuxtLink
        class="flex items-center text-like-green"
        :to="
          senderWallet
            ? localeLocation({ name: 'id', params: { id: senderWallet } })
            : ''"
        target="_blank"
      >
        <div class="flex justify-start items-center gap-[8px]">
          <Identity
            class="self-start flex-shrink-0"
            :avatar-url="senderAvatar"
            :is-avatar-outlined="false"
          />
          <div class="flex flex-col gap-[4px] justify-start">
            <p class="text-[16px] font-600 text-dark-gray">
              <span class="text-like-green">{{ senderId }}</span>
              {{ formatType }}
            </p>
            <p class="text-[12px] font-400 text-medium-gray">
              {{ formatTime }}
            </p>
          </div>
        </div>
      </NuxtLink>

      <div v-if="shouldShowFollow" class="flex items-center justify-center">
        <div class="ml-[24px]">
          <ProgressIndicator v-if="isFollowPromptUpdating" preset="thin" />
          <div
            v-else
            class="relative flex group w-[138px]"
            @click="clickFollow(senderWallet, senderId)"
          >
            <div
              :class="[
                ...getDefaultClass,
                isFollowPromptStateAuto
                  ? '!bg-like-cyan-light text-like-green'
                  : '!bg-shade-gray text-dark-gray',
              ]"
            >
              <Label align="center" :text="followPromptButtonText">
                <template v-if="isFollowPromptStateAuto" #prepend>
                  <IconCheck />
                </template>
              </Label>
            </div>
            <div
              :class="[
                ...getDefaultClass,
                'group-hover:opacity-[100]',
                'group-active:!bg-medium-gray',
                'opacity-0',
                'transition-all',
                'absolute',
                'inset-0',
                isFollowPromptStateAuto
                  ? '!bg-shade-gray text-dark-gray'
                  : '!bg-like-cyan-light text-like-green',
              ]"
            >
              <Label align="center" :text="followPromptButtonHoverText" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <NuxtLink
      :to="
        classId
          ? localeLocation({ name: 'nft-class-classId-nftId', params: { classId, nftId } })
          : ''"
      target="_blank"
    >
      <div
        v-if="shouldShowNftTitle"
        class="flex justify-start gap-[8px] items-center text-like-green pl-[12px]"
      >
        <div v-if="isEventTypeSend">
          <IconTransferMini class="text-dark-gray" />
        </div>
        <div v-else-if="isEventTypeCollect">
          <IconFlare class="text-dark-gray" />
        </div>
        <IconCreativeWork />
        <p class="text-[14px]">{{ nftTitle | ellipsisNFTName }}</p>
      </div>
    </NuxtLink>

    <div
      class="flex flex-col justify-start gap-[12px] py-[24px] px-[32px] bg-white border-2 border-shade-gray rounded-[24px] text-dark-gray"
    >
      <IconMessage v-if="shouldShowMessageIcon" />
      <p class="text-[14px] font-400 text-dark-gray">{{ formatMessage }}</p>
      <div v-if="shouldShowItemCard" class="flex items-center justify-center">
        <NFTPortfolioItem
          class="border-2 border-shade-gray rounded-[24px] -p-[2px]"
          :class-id="classId"
          :portfolio-wallet="senderWallet"
          :nft-id="nftId"
          portfolio-tab="created"
          :should-fetch-when-visible="true"
        />
      </div>
      <div
        v-if="shouldShowReceiverInfo"
        class="flex items-center justify-start gap-[6px]"
      >
        <IconTransfer class="text-medium-gray" />
        <NuxtLink
          class="flex items-center text-like-green"
          :to="
            receiverWallet
              ? localeLocation({ name: 'id', params: { id: receiverWallet } })
              : ''"
          target="_blank"
        >
          <div class="flex gap-[8px]">
            <Identity
              class="self-start flex-shrink-0"
              :avatar-url="receiverAvatar"
              :avatar-size="32"
              :is-avatar-outlined="false"
            />
            <p class="text-[14px] font-600 text-like-green">{{ receiverId }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script>
import { logTrackerEvent } from '~/util/EventLogger';

import walletMixin from '~/mixins/wallet';
import nftMixin from '~/mixins/nft';
import alertMixin from '~/mixins/alert';
import { ellipsisNFTName } from '~/util/ui';

const EVENT_TYPE = {
  COLLECT: 'collect',
  PUBLISH: 'publish',
  SEND: 'send',
  PURCHASE: 'purchase',
};

const FOLLOW_PROMPT_STATE = {
  DEFAULT: 'default', // No need to show any follow UI.
  UNFOLLOW: 'unfollow', // Show a switch button to toggle follow status.
  AUTO: 'auto', // Show auto-followed UI.
};

export default {
  name: 'SocialFeedItem',
  mixins: [walletMixin, nftMixin, alertMixin],
  filters: {
    ellipsisNFTName,
  },
  props: {
    type: {
      type: String,
      default: undefined,
    },
    senderAddress: {
      type: String,
      default: undefined,
    },
    receiverAddress: {
      type: String,
      default: undefined,
    },
    timestamp: {
      type: String,
      default: undefined,
    },
    classId: {
      type: String,
      default: undefined,
    },
    nftId: {
      type: String,
      default: undefined,
    },
    memo: {
      type: String,
      default: undefined,
    },
    granterMemo: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      followPromptState: FOLLOW_PROMPT_STATE.DEFAULT,
      isFollowPromptUpdating: false,
    };
  },
  computed: {
    senderWallet() {
      switch (this.type) {
        case EVENT_TYPE.COLLECT:
        case EVENT_TYPE.PURCHASE:
          return this.receiverAddress;

        case EVENT_TYPE.SEND:
        case EVENT_TYPE.PUBLISH:
        default:
          return this.senderAddress;
      }
    },
    receiverWallet() {
      switch (this.type) {
        case EVENT_TYPE.COLLECT:
        case EVENT_TYPE.PURCHASE:
          return this.senderAddress;

        case EVENT_TYPE.SEND:
        case EVENT_TYPE.PUBLISH:
        default:
          return this.receiverAddress;
      }
    },
    senderInfo() {
      return this.getUserInfoByAddress(this.senderWallet);
    },
    receiverInfo() {
      return this.getUserInfoByAddress(this.receiverWallet);
    },
    senderId() {
      return this.senderInfo?.displayName;
    },
    receiverId() {
      return this.receiverInfo?.displayName;
    },
    senderAvatar() {
      return this.senderInfo?.avatar;
    },
    receiverAvatar() {
      return this.receiverInfo?.avatar;
    },
    formatType() {
      switch (this.type) {
        case EVENT_TYPE.COLLECT:
        case EVENT_TYPE.PURCHASE:
          return this.$t('nft_social_feed_item_type_collected');

        case EVENT_TYPE.SEND:
          return this.$t('nft_social_feed_item_type_send');

        case EVENT_TYPE.PUBLISH:
          return this.$t('nft_social_feed_item_type_publish');

        default:
          return undefined;
      }
    },
    formatTime() {
      const date = new Date(this.timestamp);
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
      return formattedDate;
    },
    formatMessage() {
      switch (this.type) {
        case EVENT_TYPE.COLLECT:
        case EVENT_TYPE.PURCHASE:
          return this.granterMemo;

        case EVENT_TYPE.PUBLISH:
        case EVENT_TYPE.SEND:
        default:
          return this.memo;
      }
    },
    nftTitle() {
      return this.nftName || this.classId;
    },
    shouldShowNftTitle() {
      return this.type !== EVENT_TYPE.PUBLISH;
    },
    shouldShowMessageIcon() {
      return this.memo || this.granterMemo;
    },
    shouldShowItemCard() {
      return this.type === EVENT_TYPE.PUBLISH;
    },
    shouldShowReceiverInfo() {
      return this.type !== EVENT_TYPE.PUBLISH;
    },
    shouldShowFollow() {
      return !this.walletFollowees.includes(this.senderWallet);
    },
    isEventTypeSend() {
      return this.type === EVENT_TYPE.SEND;
    },
    isEventTypeCollect() {
      return this.type === EVENT_TYPE.COLLECT;
    },

    // Follow
    followPromptButtonText() {
      if (this.isFollowPromptUpdating) {
        return this.$t('nft_details_page_label_loading');
      }
      if (this.isFollowPromptStateAuto) {
        return this.$t('settings_following');
      }
      return this.$t('settings_follow_follow');
    },
    followPromptButtonHoverText() {
      if (this.isFollowPromptStateAuto) {
        return this.$t('settings_follow_unfollow');
      }
      return this.$t('settings_follow_follow');
    },
    isFollowPromptStateAuto() {
      return this.followPromptState === FOLLOW_PROMPT_STATE.AUTO;
    },
    getDefaultClass() {
      return [
        'flex',
        'gap-[16px]',
        'box-border',
        'overflow-hidden',
        'justify-center',
        'items-center',
        'transition',
        'duration-200',
        'h-40px',
        'w-full',
        'font-600',
        'px-[16px]',
        'py-[8px]',
        'rounded-[20px]',
        'cursor-pointer',
      ];
    },
  },
  methods: {
    fetchInfo() {
      this.lazyFetchNFTClassMetadata();
      this.lazyGetUserInfoByAddresses([
        this.senderAddress,
        this.receiverAddress,
      ]);
    },
    async clickFollow(followOwnerWallet, followOwnerDisplayName) {
      try {
        this.isFollowPromptUpdating = true;
        switch (this.followPromptState) {
          case FOLLOW_PROMPT_STATE.AUTO:
            this.followPromptState = FOLLOW_PROMPT_STATE.UNFOLLOW;
            await this.walletUnfollowCreator(followOwnerWallet);
            logTrackerEvent(
              this,
              'NFT',
              'social_feed_click_unfollow',
              FOLLOW_PROMPT_STATE.UNFOLLOW,
              1
            );
            break;
          case FOLLOW_PROMPT_STATE.UNFOLLOW:
          default:
            this.followPromptState = FOLLOW_PROMPT_STATE.AUTO;
            await this.walletFollowCreator(followOwnerWallet);
            logTrackerEvent(
              this,
              'NFT',
              'social_feed_click_follow',
              FOLLOW_PROMPT_STATE.AUTO,
              1
            );
            this.alertPromptSuccess(
              this.$t('portfolio_subscription_success_alert', {
                creator: followOwnerDisplayName,
              })
            );
            break;
        }
      } catch (error) {
        this.alertPromptError(error.toString());
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isFollowPromptUpdating = false;
      }
    },
  },
};
</script>
