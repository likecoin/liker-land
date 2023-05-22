<template>
  <UserStatsController
    :stat-wallet="statWallet"
  >
    <template v-slot="stats">
      <div class="flex flex-col items-center w-full mb-[18px] laptop:flex-row laptop:justify-center laptop:m-0">
        <!-- Collect section -->
        <div
          :class="[
            'flex',
            'justify-center',
            'items-center',
            'w-full',

            'laptop:justify-end',
          ]"
        >
          <div
            :class="[
              itemStyle,
              'justify-center',
              'gap-[24px]',
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
          <div
            :class="[
              itemStyle,
              'justify-center',
              'gap-[24px]',
            ]"
            @click="$emit('on-click-stakeholder-income')"
          >
            <UserStatsItem
              :is-loading="stats.isLoadingStats"
              :stats-value="stats.stakeholderIncome"
              :label-text="$t('nft_portfolio_page_state_stakeholder')"
            >
              <template #label-icon>
                <IconPriceMini />
              </template>
            </UserStatsItem>
          </div>
        </div>

        <hr
          class="hidden laptop:block h-[32px] w-[2px] bg-medium-gray mx-[12px]"
        >

        <!-- Created section -->
        <div
          :class="[
            'flex',
            'justify-center',
            'items-center',
            'w-full',

            'laptop:justify-start',
          ]"
        >
          <div
            :class="[
              itemStyle,
              'justify-center',
              'gap-[24px]',
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
          </div>
          <div
            :class="itemStyle"
            @click="$emit('on-click-total-sales')"
          >
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
        </div>
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
    itemStyle() {
      return [
        'flex',
        'rounded-[12px]',
        'p-[8px]',

        'cursor-pointer',
        'transition',
        'laptop:justify-around',
        'duration-200',
        'hover:bg-shade-gray',
      ];
    },
  },
};
</script>
