<template>
  <table class="w-full table-fixed text-[10px]">
    <thead class="border-b-shade-gray border-b-[2px]">
      <tr class="text-medium-gray py-[12px]">
        <th><Label :text="$t('nft_details_page_activity_list_event')" /></th>
        <th><Label class="break-normal" :text="$t('nft_details_page_activity_list_event_details')" /></th>
        <th><Label :text="$t('nft_details_page_activity_list_event_date')" /></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="event in populatedEvents"
        :key="[event.txHash, event.classId, event.nftId, event.event].join('-')"
        class="py-[12px] border-b-shade-gray border-b-[1px] text-dark-gray cursor-pointer hover:bg-light-gray transition-colors"
      >
        <td>
          <Label
            content-class="overflow-hidden"
          >
            {{ event.eventType }}
          </Label>
        </td>
        <td>
          <LinkV2
            :to="event.targetRoute"
            :is-inline="true"
            @click.native.stop
          >
            <span>{{ event.text }}</span>
          </LinkV2>
        </td>
        <td>
          <LinkV2 class="text-left" :href="getChainExplorerTx(event.txHash)" :is-inline="true" @click.native.stop>
            <TimeAgo class="px-[2px]" long tooltip :datetime="event.timestamp" />
          </LinkV2>
        </td>
      </tr>
    </tbody>
  </table>
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
    ...mapGetters(['getEvents', 'getAddress']),
    populatedEvents() {
      return this.getEvents.map(e => {
        let eventType = 'unknown';
        // TODO: parse as i18n message
        const text = e;
        if (e.action === '/cosmos.nft.v1beta1.MsgSend') {
          if (e.sender === LIKECOIN_NFT_API_WALLET) {
            if (e.receiver === this.getAddress) {
              eventType = 'purchase_nft';
            } else {
              eventType = 'nft_sale';
            }
          } else if (e.receiver === this.getAddress) {
            eventType = 'receive_nft';
          } else {
            eventType = 'send_nft';
          }
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
  methods: {
    ...mapActions(['fetchWalletEvents']),
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
