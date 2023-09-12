<template>
  <component
    :is="tag"
    class="flex flex-col justify-start gap-[12px]"
  >

    <header class="flex items-center justify-between gap-[1.5rem]">
      <NuxtLink
        class="flex justify-start items-center gap-[8px] text-like-green group"
        :to="
          senderWallet
            ? localeLocation({ name: 'id', params: { id: senderWallet } })
            : ''"
        target="_blank"
        @click.native="$emit('sender-click', senderWallet)"
      >
        <Identity
          class="flex-shrink-0"
          :avatar-url="senderAvatar"
          :is-avatar-outlined="false"
        />
        <div class="flex flex-col justify-start">
          <p class="text-[1rem] leading-[1.5] font-600 text-dark-gray">
            <span class="text-like-green group-hover:underline">{{ senderId }}</span>
            {{ formattedType }}
          </p>
          <p class="text-[0.75rem] leading-[2] font-400 text-medium-gray">
            {{ formattedTime }}
          </p>
        </div>
      </NuxtLink>

      <template v-if="shouldShowFollow">
        <ProgressIndicator v-if="isFollowPromptUpdating" preset="thin" />
        <ButtonV2
          v-else
          class="min-w-[138px] rounded-full"
          :text="$t('settings_follow_follow')"
          preset="tertiary"
          @click="clickFollow"
        />
      </template>
    </header>

    <div
      v-if="shouldShowNftTitle"
      class="flex justify-start gap-[8px] items-center text-like-green pl-[12px]"
    >
      <IconTransferMini v-if="isEventTypeSend" class="text-dark-gray" />
      <IconFlare v-else-if="isEventTypeCollect" class="text-dark-gray" />

      <IconCreativeWork />

      <NuxtLink
        :to="nftTitleRoute"
        class="text-[12px] hover:underline"
        target="_blank"
        @click.native="$emit('nft-title-click', { classId, nftId})"
      >{{ nftTitle | ellipsisNFTName }}</NuxtLink>
    </div>

    <!-- Feed Content -->
    <CardV2 class="flex flex-col justify-start gap-[12px] border-2 border-shade-gray text-dark-gray">

      <!-- memo -->
      <template v-if="memo">
        <IconMessage />
        <p class="text-[16px] font-400 text-dark-gray">{{ memo }}</p>
      </template>

      <!-- publish info -->
      <NFTPortfolioItem
        v-if="shouldShowItemCard"
        class="border-2 border-shade-gray rounded-[24px] -p-[2px] self-center"
        :class-id="classId"
        :portfolio-wallet="senderWallet"
        :nft-id="nftId"
        portfolio-tab="created"
        :should-fetch-when-visible="true"
        @collect="$emit('nft-collect', classId)"
        @click.native="$emit('nft-click', classId)"
      />

      <!-- send & collect receiver Info -->
      <div
        v-if="shouldShowReceiverInfoForSendOrCollect"
        class="flex items-center justify-start gap-[6px]"
      >
        <IconTransfer class="text-medium-gray" />
        <NuxtLink
          class="flex items-center justify-center gap-[8px] text-like-green group"
          :to="
            receiverWallet
              ? localeLocation({ name: 'id', params: { id: receiverWallet } })
              : ''"
          target="_blank"
          @click.native="$emit('receiver-click', receiverWallet)"
        >
          <Identity
            class="self-start flex-shrink-0"
            :avatar-url="receiverAvatar"
            :avatar-size="32"
            :is-avatar-outlined="false"
          />
          <p class="text-[14px] font-600 text-like-green group-hover:underline">{{ receiverId }}</p>
        </NuxtLink>
      </div>

      <!-- batch send receiver info -->
      <div v-if="isBatchSendEvent" class="flex flex-col gap-[12px]">
        <div class="flex gap-[8px]">
          <IconTransfer class="flex-shrink-0 text-medium-gray" />
          <ul class="flex gap-[8px] flex-wrap items-center">
            <li
              v-for="receiver of formattedBatchSendList"
              :key="receiver.wallet"
              class="flex"
            >
              <NuxtLink
                class="flex items-center justify-center gap-[8px] text-like-green group"
                :to="
                  receiver.wallet
                    ? localeLocation({
                        name: 'id',
                        params: { id: receiver.wallet },
                      })
                    : ''"
                target="_blank"
                @click.native="$emit('receiver-click', receiver.wallet)"
              >
                <Identity
                  class="self-start flex-shrink-0"
                  :avatar-url="receiver.avatar"
                  :avatar-size="32"
                  :is-avatar-outlined="false"
                />
                <p class="text-[14px] font-600 text-like-green group-hover:underline">
                  {{ receiver.displayName }}
                </p>
              </NuxtLink>
            </li>
            <li v-if="numberOfAlsoSendTo">
              <p class="text-[0.75rem] leading-[2] font-400 text-medium-gray">
                {{ $tc('feed_also_send_to', numberOfAlsoSendTo, { num: numberOfAlsoSendTo }) }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </CardV2>

  </component>
</template>
<script>
import walletMixin from '~/mixins/wallet';
import nftMixin from '~/mixins/nft';
import alertMixin from '~/mixins/alert';
import { ellipsisNFTName, ellipsis } from '~/util/ui';

const EVENT_TYPE = {
  COLLECT: 'collect',
  PUBLISH: 'publish',
  SEND: 'send',
  PURCHASE: 'purchase',
};

export default {
  name: 'SocialFeedItem',
  filters: {
    ellipsisNFTName,
  },
  mixins: [walletMixin, nftMixin, alertMixin],
  props: {
    tag: {
      type: String,
      default: 'div',
    },
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
    batchSendList: {
      type: Array,
      default: null,
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
  },
  data() {
    return {
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
          return this.iscnOwner;

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
      return ellipsis(this.senderInfo?.displayName || this.senderWallet);
    },
    receiverId() {
      return ellipsis(this.receiverInfo?.displayName || this.receiverWallet);
    },
    senderAvatar() {
      return this.senderInfo?.avatar;
    },
    receiverAvatar() {
      return this.receiverInfo?.avatar;
    },
    formattedType() {
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
    formattedTime() {
      const date = new Date(this.timestamp);
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
      return formattedDate;
    },
    nftTitle() {
      return this.nftName || this.classId;
    },
    nftTitleRoute() {
      let link = '';
      if (this.isBatchSendEvent) {
        link = this.localeLocation({
          name: 'nft-class-classId',
          params: { classId: this.classId },
        });
      } else {
        link = this.localeLocation({
          name: 'nft-class-classId-nftId',
          params: { classId: this.classId, nftId: this.nftId },
        });
      }
      return this.classId && link;
    },
    shouldShowNftTitle() {
      return this.type !== EVENT_TYPE.PUBLISH;
    },
    shouldShowItemCard() {
      return this.type === EVENT_TYPE.PUBLISH;
    },
    shouldShowReceiverInfoForSendOrCollect() {
      return this.type !== EVENT_TYPE.PUBLISH && !this.isBatchSendEvent;
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
    isBatchSendEvent() {
      return this.type === 'send' && this.batchSendList?.length;
    },
    formattedBatchSendList() {
      if (!this.isBatchSendEvent) {
        return [];
      }
      const filteredBatchSendList = this.batchSendList
        .filter(
          receiver =>
            this.walletFollowees.includes(receiver) ||
            this.getAddress === receiver
        )
        .slice(0, 8);

      if (!filteredBatchSendList.length) {
        filteredBatchSendList.push(this.getAddress);
      }

      const batchSendListWithInfo = filteredBatchSendList.map(receiver => ({
        wallet: receiver,
        avatar: this.getUserInfoByAddress(receiver)?.avatar,
        displayName: ellipsis(
          this.getUserInfoByAddress(receiver)?.displayName || receiver
        ),
      }));

      return batchSendListWithInfo;
    },
    numberOfAlsoSendTo() {
      let num = 0;
      if (this.batchSendList?.length > this.formattedBatchSendList.length) {
        num = this.batchSendList.length - this.formattedBatchSendList.length;
      }
      return num;
    },
  },
  methods: {
    async clickFollow() {
      if (this.isFollowPromptUpdating) return;

      try {
        this.isFollowPromptUpdating = true;
        this.$emit('follow', this.senderWallet);
        await this.walletFollowCreator(this.senderWallet);
        this.alertPromptSuccess(
          this.$t('portfolio_subscription_success_alert', {
            creator: this.senderId,
          })
        );
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
