<template>
  <UserStatsController
    :class="[
      'bg-white',
      'p-[24px]',
      'rounded-[24px]',
      'grid',
      'grid-cols-2',
      'auto-rows-[1fr]',
      'justify-center',
      'items-stretch',
    ]"
    :stat-wallet="statWallet"
  >
    <template #default="stats">
      <!-- Collect section -->
      <div
        :class="[itemClasses, 'grid-cols-2', 'col-span-2', 'w-full']"
        @click="$emit('go-collected')"
      >
        <UserStatsItem
          :is-loading="stats.isLoadingStats"
          :stats-value="stats.collectedCount"
          :label-text="$t('nft_portfolio_page_label_collected')"
        >
          <template #icon>
            <IconMint class="w-[16px] h-[16px]" />
          </template>
        </UserStatsItem>
        <UserStatsItem
          :is-loading="stats.isLoadingStats"
          :stats-value="stats.collectedAmount"
          :label-text="$t('nft_portfolio_page_state_value')"
        >
          <template #icon>
            <IconPriceMini />
          </template>
        </UserStatsItem>
      </div>

      <!-- Created section -->
      <div
        :class="[itemClasses, 'grid-cols-2', 'col-span-2', 'w-full']"
        @click="$emit('go-created')"
      >
        <UserStatsItem
          :is-loading="stats.isLoadingStats"
          :stats-value="stats.createdCount"
          :label-text="$t('nft_portfolio_page_label_created')"
        >
          <template #icon>
            <IconFlare class="w-[16px] h-[16px]" />
          </template>
        </UserStatsItem>
        <UserStatsItem
          :is-loading="stats.isLoadingStats"
          :stats-value="stats.createdCollectorCount"
          :label-text="$t('nft_portfolio_page_state_collectors')"
        >
          <template #icon>
            <IconPersonMini />
          </template>
        </UserStatsItem>
      </div>

      <div
        :class="[itemClasses, 'col-span-2']"
        @click="$emit('click-total-sales')"
      >
        <UserStatsItem
          :stats-value="stats.createdTotalSales"
          stats-class="text-airdrop-gold"
        >
          <template #icon>
            <IconPriceMini />
          </template>
          <template #label>
            <span
              >{{ $t('nft_portfolio_page_state_sales') }}
              <IconOpenInNew class="inline-block text-medium-gray"
            /></span>
          </template>
        </UserStatsItem>
      </div>
    </template>
  </UserStatsController>
</template>
<script>
export default {
  props: {
    statWallet: {
      type: String,
      default: '',
    },
  },
  computed: {
    itemClasses() {
      return [
        'grid',
        'justify-around',
        'self-stretch',
        'gap-[24px]',
        'rounded-[12px]',
        'p-[8px]',

        'cursor-pointer',
        'transition',
        'duration-200',
        'hover:bg-shade-gray',
      ];
    },
  },
};
</script>
