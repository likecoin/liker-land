<template>
  <UserStatsController
    :class="[
      'grid',
      'grid-cols-2 laptop:grid-cols-5',
      'auto-rows-[1fr]',
      'justify-center',
      'items-stretch',
      'gap-[16px]',
      'mb-[18px] laptop:m-0',
    ]"
    :stat-wallet="statWallet"
  >
    <template v-slot="stats">
      <!-- Collect section -->
      <div class="relative flex items-center col-span-2">
        <div
          :class="[
            itemClasses,
            'grid-cols-2',
            'w-full',
          ]"
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
        <hr :class="separatorClasses">
      </div>

      <!-- Created section -->
      <div class="relative flex items-center col-span-2">
        <div
          :class="[
            itemClasses,
            'grid-cols-2',
            'w-full',
          ]"
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
        <hr :class="separatorClasses">
      </div>

      <div
        :class="[
          itemClasses,
          'col-span-2 laptop:col-span-1',
        ]"
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
            <span>{{ $t('nft_portfolio_page_state_sales') }} <IconOpenInNew class="inline-block text-medium-gray" /></span>
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
    separatorClasses() {
      return [
        'absolute',
        'right-0',
        'hidden laptop:block',
        'h-[32px]',
        'w-[1px]',
        'mr-[-8px]',
        'bg-medium-gray',
        'border-0',
      ];
    },
  },
};
</script>
