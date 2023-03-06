<template>
  <UserStatsController
    class="flex flex-col items-center w-full laptop:flex-row"
    :stat-wallet="statWallet"
  >
    <template v-slot="stats">
      <div
        :class="[
          'flex',
          'justify-around',
          'rounded-[12px]',
          'w-full',
          'p-[12px]',

          'mb-[18px]',
          'laptop:m-0',

          'cursor-pointer',
          'transition',
          'duration-200',
          'hover:bg-shade-gray',
        ]"
        @click="$emit('go-collected')"
      >
        <UserStatsItem
          :is-loading="stats.isLoadingStats"
          :stats-value="stats.collectedCount"
          :label-text="$t('nft_portfolio_page_label_collected')"
        >
          <template #label-icon>
            <IconMint />
          </template>
        </UserStatsItem>
        <UserStatsItem
          :is-loading="stats.isLoadingStats"
          :stats-value="stats.collectedAmount"
          :label-text="$t('nft_portfolio_page_state_value')"
        >
          <template #label-icon>
            <IconPriceMini />
          </template>
        </UserStatsItem>
      </div>
      <hr
        class="hidden laptop:block h-[32px] w-[2px] bg-medium-gray mx-[12px]"
      >
      <div
        :class=" [
          'flex',
          'justify-center',
          'gap-[12px]',
          'rounded-[12px]',
          'w-full',
          'p-[4px]',
          'cursor-pointer',
          'transition',
          'duration-200',
          'laptop:p-[12px]',
          'laptop:justify-around',
          'laptop:gap-0',
          'hover:bg-shade-gray',
        ]"
        @click="$emit('go-created')"
      >
        <UserStatsItem
          :is-loading="stats.isLoadingStats"
          :stats-value="stats.createdCount"
          :label-text="$t('nft_portfolio_page_label_created')"
        >
          <template #label-icon>
            <IconFlare />
          </template>
        </UserStatsItem>
        <UserStatsItem
          :is-loading="stats.isLoadingStats"
          :stats-value="stats.createdCollectorCount"
          :label-text="$t('nft_portfolio_page_state_collectors')"
        >
          <template #label-icon>
            <IconPersonMini />
          </template>
        </UserStatsItem>
        <UserStatsItem
          :is-loading="stats.isLoadingStats"
          :stats-value="stats.createdTotalSales"
          :label-text="$t('nft_portfolio_page_state_sales')"
        >
          <template #label-icon>
            <IconPriceMini />
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
};
</script>
