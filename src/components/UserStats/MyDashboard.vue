<template>
  <UserStatsController
    :stat-wallet="statWallet"
  >
    <template v-slot="stats">
      <div class="flex flex-col justify-center items-center w-full mb-[18px] laptop:flex-row laptop:justify-center laptop:m-0">
        <!-- Collect section -->
        <div
          :class="[
            'flex',
            'justify-center',
            'items-center',
          ]"
        >
          <div
            :class="[
              itemClasses,
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
          ]"
        >
          <div
            :class="[
              itemClasses,
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
          <hr
            class="hidden laptop:block h-[32px] w-[2px] bg-medium-gray mx-[12px]"
          >
          <div
            :class="[itemClasses, 'items-center', 'gap-[8px]']"
            @click="$emit('click-total-sales')"
          >
            <div class="flex flex-col items-center justify-center">
              <Label
                class="text-airdrop-gold text-[14px] font-600 laptop:text-[24px]"
                valign="bottom"
                :text="isLoading ? '-' : stats.createdTotalSales"
              />
              <Label
                class="text-medium-gray mt-[4px] text-[10px] font-400 laptop:text-[14px] laptop:font-600"
                content-class="text-center whitespace-pre"
                :text="$t('nft_portfolio_page_state_sales')"
                valign="middle"
              >
                <template #prepend>
                  <IconPriceMini />
                </template>
              </Label>
            </div>
            <IconPopup class="text-medium-gray" />
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
    itemClasses() {
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
