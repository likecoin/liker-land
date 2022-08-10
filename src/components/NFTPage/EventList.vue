<template>
  <DropDownList
    class="w-full mb-[250px]"
    :title="$t('nft_details_page_activity_list_title')"
  >
    <template #titleIcon>
      <IconActivity />
    </template>
    <template #content>
      <table v-if="nftHistory.length" class="w-full table-fixed text-[10px]">
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
            class="py-[12px] border-b-shade-gray border-b-[1px]"
          >
            <td>
              <Label v-if="event.event === 'purchase'" :text="$t('nft_details_page_activity_list_event_collect')">
                <template #prepend>
                  <IconCircle />
                </template>
              </Label>
              <Label v-else-if="event.event === 'transfer'" :text="$t('nft_details_page_activity_list_event_transfer')">
                <template #prepend>
                  <IconTransfer />
                </template>
              </Label>
            </td>
            <td>
              <Label>{{ event.price || '-' }}</Label>
            </td>
            <td>
              <Label v-if="event.event === 'purchase'">-</Label>
              <LinkV2 v-else-if="event.event === 'transfer'" :to="`/${event.fromWallet}`">
                <Label class="break-all">{{
                  event.fromDisplayName | ellipsis
                }}</Label>
              </LinkV2>
            </td>
            <td>
              <LinkV2 :to="`/${event.toWallet}`">
                <Label class="break-all">{{
                  event.toDisplayName | ellipsis
                }}</Label>
              </LinkV2>
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
      <div v-else class="flex justify-center">
        <Label preset="p6" class="my-[12px]" :text="$t('nft_details_page_label_no_record')" />
      </div>
    </template>
  </DropDownList>
</template>
<script>
import { TimeAgo } from 'vue2-timeago';
import { ellipsis } from '~/util/ui';
import { getChainRawTx } from '~/util/api';

export default {
  name: 'EventList',
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
