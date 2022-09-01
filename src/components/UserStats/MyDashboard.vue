<template>
  <UserStatsBase
    class="flex flex-col items-center w-full laptop:flex-row"
    :collected-items="collectedItems"
    :created-class-ids="createdClassIds"
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
          :is-loading="isLoading"
          :stats-value="stats.collectedCount.toString()"
          :label-text="$t('nft_portfolio_page_label_collected')"
        >
          <template #label-icon>
            <IconMint />
          </template>
        </UserStatsItem>
        <UserStatsItem
          :is-loading="isLoading"
          preset="custom"
          :label-text="$t('nft_portfolio_page_state_value')"
        >
          <template #custom-stats>
            <div class="flex items-end">
              <Label
                preset="h3"
                class="text-like-green"
                :text="`${Math.ceil(stats.collectedAmount).toLocaleString(
                  'en-US')}`"
              />&nbsp;<span class="text-like-green">{{ $t('header_menu_LIKE') }}</span>
            </div>
          </template>
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
          'justify-around',
          'rounded-[12px]',
          'w-full',
          'p-[12px]',
          'cursor-pointer',
          'transition',
          'duration-200',
          'hover:bg-shade-gray',
        ]"
        @click="$emit('go-created')"
      >
        <UserStatsItem
          :is-loading="isLoading"
          :stats-value="stats.createdCount.toString()"
          :label-text="$t('nft_portfolio_page_label_created')"
        >
          <template #label-icon>
            <IconFlare />
          </template>
        </UserStatsItem>
        <UserStatsItem
          :is-loading="isLoading"
          :stats-value="stats.createdCollectorCount.toString()"
          :label-text="$t('nft_portfolio_page_state_collectors')"
        >
          <template #label-icon>
            <IconPersonMini />
          </template>
        </UserStatsItem>
      </div>
    </template>
  </UserStatsBase>
</template>
<script>
export default {
  props: {
    collectedItems: {
      type: Array,
      default: () => [],
    },
    createdClassIds: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
