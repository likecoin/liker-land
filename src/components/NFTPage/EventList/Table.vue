<template>
  <table class="w-full table-fixed text-[10px]">
    <thead class="border-b-shade-gray border-b-[2px]">
      <tr class="text-medium-gray py-[12px]">
        <th><Label :text="$t('nft_details_page_activity_list_event')" /></th>
        <th><Label class="break-normal" :text="$t('nft_details_page_activity_list_event_price')" /></th>
        <th><Label :text="$t('nft_details_page_activity_list_event_from')" /></th>
        <th><Label :text="$t('nft_details_page_activity_list_event_to')" /></th>
        <th><Label :text="$t('nft_details_page_activity_list_event_date')" /></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="event in nftHistory"
        :key="[event.txHash, event.classId, event.nftId, event.event].join('-')"
        class="py-[12px] border-b-shade-gray border-b-[1px] text-dark-gray"
      >
        <td>
          <Label
            v-if="event.event === 'purchase'"
            :text="$t('nft_details_page_activity_list_event_collect')"
          >
            <template #prepend>
              <IconCircle />
            </template>
          </Label>
          <Label
            v-else-if="event.event === 'buy_nft'"
            :text="$t('nft_details_page_activity_list_event_buy_nft')"
          >
            <template #prepend>
              <IconCircle />
            </template>
          </Label>
          <Label
            v-else-if="event.event === 'transfer'"
            :text="$t('nft_details_page_activity_list_event_transfer')"
          >
            <template #prepend>
              <IconTransferMini />
            </template>
          </Label>
          <Label
            v-else-if="event.event === 'mint_nft'"
            :text="$t('nft_details_page_activity_list_event_mint_nft')"
          >
            <template #prepend>
              <IconFlare />
            </template>
          </Label>
          <Label
            v-else-if="event.event === 'new_class'"
            :text="$t('nft_details_page_activity_list_event_create_class')"
          >
            <template #prepend>
              <IconFlare />
            </template>
          </Label>
          <Label
            v-else
            :text="event.event"
          >
            <template #prepend>
              <IconCircle />
            </template>
          </Label>
        </td>
        <td>
          <Label v-if="event.price" class="break-all" :text="event.price | formatNumber" />
          <Label v-else class="break-all" text="-" />
        </td>
        <td>
          <LinkV2 v-if="['new_class', 'mint_nft' ,'transfer', 'buy_nft'].includes(event.event)" :to="`/${event.fromWallet}`">
            <Label class="break-all">{{
              event.fromDisplayName | ellipsis
            }}</Label>
          </LinkV2>
          <Label v-else>-</Label>
        </td>
        <td>
          <LinkV2 v-if="['purchase' ,'transfer', 'buy_nft'].includes(event.event)" :to="`/${event.toWallet}`">
            <Label class="break-all">{{
              event.toDisplayName | ellipsis
            }}</Label>
          </LinkV2>
          <Label v-else>-</Label>
        </td>
        <td>
          <LinkV2 class="text-left" :href="getChainExplorerTx(event.txHash)">
            <TimeAgo
              class="px-[2px]"
              long
              tooltip
              :datetime="event.timestamp"
            />
          </LinkV2>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { ellipsis, formatNumber } from '~/util/ui';
import { TimeAgo } from 'vue2-timeago';
import { getChainExplorerTx } from '~/util/api';

export default {
  name: 'EventListTable',
  filters: {
    ellipsis,
    formatNumber,
  },
  components: { TimeAgo },
  props: {
    nftHistory: {
      type: Array,
      default: undefined,
    },
  },
  methods: { getChainExplorerTx },
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
