<template>
  <table class="w-full table-fixed text-[10px]">
    <thead class="border-b-shade-gray border-b-[2px]">
      <tr class="text-medium-gray py-[12px]">
        <th><Label :text="$t('nft_details_page_activity_list_event')" /></th>
        <th><Label class="break-normal" :text="$t('nft_details_page_activity_list_event_price')" /></th>
        <th><Label :text="$t('nft_details_page_activity_list_event_from')" /></th>
        <th><Label :text="$t('nft_details_page_activity_list_event_to')" /></th>
        <th><Label :text="$t('nft_details_page_activity_list_event_date')" /></th>
        <th v-if="showMemo"><Label :text="$t('nft_details_page_activity_list_event_memo')" /></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="event in nftHistory"
        :key="[event.txHash, event.classId, event.nftId, event.event].join('-')"
        class="py-[12px] border-b-shade-gray border-b-[1px] text-dark-gray cursor-pointer hover:bg-light-gray transition-colors"
        @click="handleRowClick(event)"
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
            v-else-if="event.event === 'buy_nft' || event.event === 'sell_nft'"
            :text="$t('nft_details_page_activity_list_event_buy_nft')"
          >
            <template #prepend>
              <IconExchange />
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
          <Label
            v-if="event.price"
            content-class="overflow-hidden"
          >
            <span class="truncate">{{ event.price | formatNumber }}</span>
          </Label>
          <Label v-else text="-" />
        </td>
        <td>
          <Label
            v-if="['new_class', 'mint_nft' ,'transfer', 'buy_nft', 'sell_nft'].includes(event.event)"
            content-class="overflow-hidden"
          >
            <LinkV2
              class="overflow-hidden"
              :to="localeLocation({ name: 'id', params: { id: event.fromWallet } })"
              :is-inline="true"
              @click.native.stop
            >
              <span class="truncate">{{ event.fromDisplayName }}</span>
            </LinkV2>
          </Label>
          <Label v-else text="-" />
        </td>
        <td>
          <Label
            v-if="['purchase' ,'transfer', 'buy_nft', 'sell_nft'].includes(event.event)"
            content-class="overflow-hidden"
          >
            <LinkV2
              class="overflow-hidden"
              :to="localeLocation({ name: 'id', params: { id: event.toWallet } })"
              :is-inline="true"
              @click.native.stop
            >
              <span class="truncate">{{ event.toDisplayName }}</span>
            </LinkV2>
          </Label>
          <Label v-else text="-" />
        </td>
        <td>
          <LinkV2
            class="text-left"
            :href="getChainExplorerTx(event.txHash)"
            :is-inline="true"
            @click.native.stop
          >
            <TimeAgo
              class="px-[2px]"
              long
              tooltip
              :datetime="event.timestamp"
            />
          </LinkV2>
        </td>
        <td v-if="showMemo">
          <Label content-class="overflow-hidden">
            <span class="truncate">
              {{ event.event === 'purchase' ? event.granterMemo : event.memo }}
            </span>
          </Label>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { formatNumber } from '~/util/ui';
import { TimeAgo } from 'vue2-timeago';
import { getChainExplorerTx } from '~/util/api';

export default {
  name: 'EventListTable',
  filters: {
    formatNumber,
  },
  components: { TimeAgo },
  props: {
    nftHistory: {
      type: Array,
      default: undefined,
    },
    showMemo: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getChainExplorerTx,
    handleRowClick(event) {
      this.$router.push(
        this.localeLocation({
          name: event.nftId ? 'nft-class-classId-nftId' : 'nft-class-classId',
          params: { classId: event.classId, nftId: event.nftId },
        })
      );
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
