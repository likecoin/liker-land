<template>
  <Page class="px-[8px]">
    <div>
      <ButtonV2 @click="handleRefresh()">{{ $t('event_list_page_event_refresh') }}</ButtonV2>
      <table class="w-full table-fixed text-[10px]">
        <thead class="border-b-shade-gray border-b-[2px]">
          <tr class="text-medium-gray py-[12px]">
            <th><Label :text="$t('event_list_page_event_header_type')" /></th>
            <th><Label class="break-normal" :text="$t('event_list_page_event_header_details')" /></th>
            <th><Label :text="$t('event_list_page_event_header_time')" /></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in populatedEvents"
            :key="[event.tx_hash, event.class_id, event.nft_id, event.eventType].join('-')"
            class="py-[12px] border-b-shade-gray border-b-[1px] text-dark-gray cursor-pointer hover:bg-light-gray transition-colors"
          >
            <td>
              <Label content-class="overflow-hidden">
                {{ event.eventType }}
              </Label>
            </td>
            <td>
              <LinkV2 :to="event.targetRoute" :is-inline="true" @click.native.stop>
                <span>{{ event.text }}</span>
              </LinkV2>
            </td>
            <td>
              <LinkV2 class="text-left" :href="getChainExplorerTx(event.tx_hash)" :is-inline="true" @click.native.stop>
                <TimeAgo class="px-[2px]" long tooltip :datetime="event.timestamp" />
              </LinkV2>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Page>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { LIKECOIN_NFT_API_WALLET } from '~/constant';
import { TimeAgo } from 'vue2-timeago';
import { getChainExplorerTx } from '~/util/api';

export default {
  name: 'WalletEventsPage',
  components: { TimeAgo },
  computed: {
    ...mapGetters([
      'getEvents',
      'getAddress',
      'getUserInfoByAddress',
      'getNFTClassMetadataById',
      'getHasUnseenEvents',
    ]),
    populatedEvents() {
      return this.getEvents.map(e => {
        let eventType = 'unknown';
        let text = e;
        let memo = e.memo === 'like.co NFT API' ? '' : e.memo;
        if (e.action === '/cosmos.nft.v1beta1.MsgSend') {
          const nftName = this.getNFTClassMetadataById(e.class_id)?.name;
          if (e.sender === LIKECOIN_NFT_API_WALLET) {
            if (e.receiver === this.getAddress) {
              eventType = 'purchase_nft';
              const creator = this.getNFTClassMetadataById(e.class_id)
                ?.iscn_owner;
              text = this.$t('event_list_page_event_message_purchase_nft', {
                nftName,
                price: e.price,
                creator:
                  this.getUserInfoByAddress(creator)?.displayName || creator,
              });
              memo = e.granterMemo || '';
            } else {
              eventType = 'nft_sale';
              text = this.$t('event_list_page_event_message_nft_sale', {
                nftName,
                price: e.price,
                buyer:
                  this.getUserInfoByAddress(e.receiver)?.displayName ||
                  e.receiver,
              });
            }
          } else if (e.receiver === this.getAddress) {
            eventType = 'receive_nft';
            text = this.$t('event_list_page_event_message_receive_nft', {
              nftName,
              sender:
                this.getUserInfoByAddress(e.sender)?.displayName || e.sender,
            });
          } else {
            eventType = 'send_nft';
            text = this.$t('event_list_page_event_message_send_nft', {
              nftName,
              receiver:
                this.getUserInfoByAddress(e.receiver)?.displayName ||
                e.receiver,
            });
          }
          if (memo)
            text += ` ${this.$t(
              'event_list_page_event_message_nft_memo'
            )}${memo}`;
        }
        return {
          eventType,
          text,
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
  },
  mounted() {
    if (this.getHasUnseenEvents) {
      this.updateEventLastSeenTs();
    }
  },
  methods: {
    ...mapActions(['fetchWalletEvents', 'updateEventLastSeenTs']),
    getChainExplorerTx,
    handleRefresh() {
      this.fetchWalletEvents();
    },
  },
};
</script>

<style scoped>
th,
td {
  padding-top: 12px;
  padding-bottom: 12px;
  font-weight: 400;
}
</style>
