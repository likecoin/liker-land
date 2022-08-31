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
        :key="`${event.txHash}event`"
        class="py-[12px] border-b-shade-gray border-b-[1px] text-dark-gray"
      >
        <td>
          <Label v-if="event.event === 'purchase'" class="break-all" :text="$t('nft_details_page_activity_list_event_collect')">
            <template #prepend>
              <IconCircle />
            </template>
          </Label>
          <Label v-else-if="event.event === 'transfer'" class="break-all" :text="$t('nft_details_page_activity_list_event_transfer')">
            <template #prepend>
              <IconTransferMini />
            </template>
          </Label>
          <Label v-else-if="event.event === 'mint_nft'" class="break-all" :text="$t('nft_details_page_activity_list_event_mint_nft')" />
          <Label v-else-if="event.event === 'new_class'" class="break-all" :text="$t('nft_details_page_activity_list_event_create_class')" />
        </td>
        <td>
          <Label class="break-all">{{ event.price || '-' }}</Label>
        </td>
        <td>
          <LinkV2 v-if="event.event === 'transfer'" :to="`/${event.fromWallet}`">
            <Label class="break-all">{{
              event.fromDisplayName | ellipsis
            }}</Label>
          </LinkV2>
          <Label v-else>-</Label>
        </td>
        <td>
          <LinkV2 v-if="event.event === 'transfer' || event.event === 'purchase'" :to="`/${event.toWallet}`">
            <Label class="break-all">{{
              event.toDisplayName | ellipsis
            }}</Label>
          </LinkV2>
          <Label v-else>-</Label>
        </td>
        <td>
          <LinkV2 class="text-left" :href="getChainRawTx(event.txHash)">
            <TimeAgo
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
import { ellipsis } from '~/util/ui';
import { TimeAgo } from 'vue2-timeago';
import { getChainRawTx } from '~/util/api';

export default {
  name: 'EventListTable',
  filters: {
    ellipsis,
  },
  components: { TimeAgo },
  props: {
    nftHistory: {
      type: Array,
      default: undefined,
    },
  },
  methods: { getChainRawTx },
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
