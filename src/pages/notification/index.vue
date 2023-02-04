<template>
  <Page class="overflow-x-hidden">
    <div class="flex flex-col relative w-full max-w-[962px] mx-auto mb-[48px]">
      <Label
        preset="h5"
        class="text-like-green mb-[8px]"
        :text="$t('event_list_page_notifications', { number: getNotificationCount })"
      >
        <template #prepend>
          <IconBell />
        </template>
        <template #append>
          <ButtonV2 preset="tertiary" @click="handleRefresh">
            <IconRefresh />
          </ButtonV2>
        </template>
      </Label>
      <hr class="border-shade-gray border-[1px]">
      <div v-if="isLoading || !processedEvents.length" class="flex items-center justify-center">
        <CardV2 class="flex p-[8px] my-[48px]">
          <Label preset="h5" class="text-like-green" :text="$t('nft_portfolio_page_label_loading')" />
        </CardV2>
      </div>
      <div
        v-for="group in groupedEventsByTime"
        v-else
        :key="group.date"
        class="flex flex-col items-start my-[12px]"
      >
        <!-- date group -->
        <div
          :class="[
            'py-[4px]',
            'px-[8px]',
            'mt-[12px]',
            'mb-[8px]',
            'text-medium-gray',
            'font-600',
            'text-[14px]',
            'w-auto',
          ]"
        >
          {{ group.date }}
        </div>
        <!-- events -->
        <LinkV2
          v-for="event in group.events"
          :key="[event.tx_hash, event.class_id, event.nft_id, event.eventType].join('-')"
          :to="event.targetRoute"
          :class="[
            'flex',
            'justify-between',
            'items-center',

            'px-[16px]',
            'py-[20px]',
            'my-[4px]',
            'bg-white',
            'shadow-sm',
            'rounded-[4px]',
            'w-full',

            'group',
            'no-underline',
            'cursor-pointer',
            'hover:bg-shade-gray',
            'duration-100',
            'transition-colors',
          ]"
          @click.native.stop
        >
          <div class="flex items-center justify-start gap-[24px] mr-[12px]">
            <!-- dot -->
            <div
              :class="[
                'flex',
                'justify-center',
                'items-start',
                'pl-[8px]',
                'pt-[12px]',
                'self-start',
              ]"
            >
              <div
                v-if="!event.eventHasSeen"
                class="bg-danger rounded-[50%] w-[8px] h-[8px]"
              />
            </div>
            <!-- avatar -->
            <Identity
              class="self-start flex-shrink-0"
              :avatar-url="event.displayAvatar"
              :avatar-size="38"
            />
            <!-- info -->
            <div class="flex flex-col items-start justify-center">
              <i18n
                :class="[
                  'text-dark-gray',
                  'text-14',
                  { 'text-medium-gray': event.eventHasSeen },
                ]"
                :path="event.i18nPath"
              >
                <p
                  class="inline text-black font-600 text-16"
                  place="fromName"
                >{{ event.fromName }}</p>
                <p
                  class="inline text-black font-600 text-16"
                  place="toName"
                >{{ event.toName }}</p>
                <p
                  class="inline italic text-black font-600"
                  place="nftName"
                >
                  {{ event.nftName }}
                </p>
                <p
                  class="inline text-like-green font-600"
                  place="price"
                >{{ event.price }}</p>

              </i18n>
              <div
                v-if="event.message"
                :class="[
                  'flex',
                  'items-center',
                  'px-[12px]',
                  'py-[6px]',
                  'mt-[4px]',
                  'border-[2px]',
                  'border-shade-gray',
                  'rounded-[4px]',

                  'group-hover:border-light-gray',
                  'duration-75',
                  'transition-all'
                ]"
              >
                <Label
                  preset="p6"
                  align="middle"
                  class="text-medium-gray"
                  :text="event.message"
                />
              </div>
            </div>
          </div>
          <!-- timestamp-hour -->
          <div class="text-medium-gray text-10">
            {{ formatLocalTime(event.timestamp) }}
          </div>
        </LinkV2>
      </div>
    </div>
  </Page>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { LIKECOIN_NFT_API_WALLET } from '~/constant';
import { getChainExplorerTx } from '~/util/api';
import { ellipsis } from '~/util/ui';

export default {
  name: 'NotificationPage',
  layout: 'default',
  filters: {
    ellipsis,
  },
  data() {
    return { isLoading: false };
  },
  computed: {
    ...mapGetters([
      'getEvents',
      'getAddress',
      'getUserInfoByAddress',
      'getNFTClassMetadataById',
      'getHasUnseenEvents',
      'getNotificationCount',
    ]),
    processedEvents() {
      return this.getEvents.map(e => {
        let eventType = 'unknown';
        let displayAvatar;
        let i18nPath;
        let message;
        let fromName;
        let toName;
        let price;

        let memo = e.memo === 'like.co NFT API' ? '' : e.memo;
        const nftName = this.getNFTClassMetadataById(e.class_id)?.name;
        if (e.sender === LIKECOIN_NFT_API_WALLET) {
          if (e.receiver === this.getAddress) {
            eventType = 'purchase_nft';
            const creator = this.getNFTClassMetadataById(e.class_id)
              ?.iscn_owner;
            displayAvatar = this.getUserInfoByAddress(this.getAddress)?.avatar;
            i18nPath = 'event_list_page_event_message_purchase_nft';
            fromName = this.$t('event_list_page_event_self');
            toName = this.getUserInfoByAddress(creator)?.displayName || creator;
            // eslint-disable-next-line prefer-destructuring
            price = e.price;
            memo = e.granterMemo || '';
          } else {
            eventType = 'nft_sale';
            fromName =
              this.getUserInfoByAddress(e.receiver)?.displayName || e.receiver;
            // eslint-disable-next-line prefer-destructuring
            price = e.price;
            i18nPath = 'event_list_page_event_message_nft_sale';
            displayAvatar = this.getUserInfoByAddress(e.receiver)?.avatar;
            memo = e.granterMemo || '';
          }
        } else if (e.receiver === this.getAddress) {
          eventType = 'receive_nft';
          fromName =
            this.getUserInfoByAddress(e.sender)?.displayName || e.sender;
          i18nPath = 'event_list_page_event_message_receive_nft';
          displayAvatar = this.getUserInfoByAddress(e.sender)?.avatar;
        } else {
          eventType = 'send_nft';
          fromName = this.$t('event_list_page_event_self');
          toName =
            this.getUserInfoByAddress(e.receiver)?.displayName || e.receiver;
          i18nPath = 'event_list_page_event_message_send_nft';
          displayAvatar = this.getUserInfoByAddress(e.receiver)?.avatar;
        }
        if (memo) {
          message = memo;
        }

        return {
          eventType,
          displayAvatar,
          message,
          fromName,
          toName,
          price,
          nftName,
          i18nPath,
          targetRoute: {
            name: e.nft_id ? 'nft-class-classId-nftId' : 'nft-class-classId',
            params: {
              classId: e.class_id,
              nftId: e.nft_id,
            },
          },
          ...e,
        };
      });
    },
    groupedEventsByTime() {
      return this.convertToGroupedEvents(this.processedEvents);
    },
  },
  mounted() {
    if (this.getHasUnseenEvents) {
      this.updateEventLastSeenTs();
    }
  },
  methods: {
    ...mapActions(['fetchWalletEvents', 'updateEventLastSeenTs']),
    getChainExplorerTx,
    async handleRefresh() {
      this.isLoading = true;
      await this.fetchWalletEvents();
      this.isLoading = false;
    },
    convertToGroupedEvents(events) {
      const result = [];
      const groupedEvents = {};

      events.forEach(event => {
        let date;
        const today = new Date().setHours(0, 0, 0, 0);
        const yesterday = today - 86400000;
        const eventDate = new Date(event.timestamp).setHours(0, 0, 0, 0);
        if (eventDate === today) {
          date = this.$t('event_list_page_today');
        } else if (eventDate === yesterday) {
          date = this.$t('event_list_page_yesterday');
        } else {
          date = event.timestamp.toLocaleDateString('en-US');
        }
        if (!groupedEvents[date]) {
          groupedEvents[date] = [];
        }
        groupedEvents[date].push(event);
      });

      Object.keys(groupedEvents).forEach(date => {
        result.push({
          date,
          events: groupedEvents[date],
        });
      });

      return result;
    },
    formatLocalTime(timestamp) {
      const hour =
        timestamp.getHours() >= 10
          ? timestamp.getHours()
          : `0${timestamp.getHours()}`;
      const minutes =
        timestamp.getMinutes() >= 10
          ? timestamp.getMinutes()
          : `0${timestamp.getMinutes()}`;
      return `${hour}:${minutes}`;
    },
  },
};
</script>
