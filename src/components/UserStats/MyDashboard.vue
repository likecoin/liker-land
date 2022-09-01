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
        <div class="flex flex-col items-center justify-center">
          <Label
            preset="h3"
            class="text-like-green mb-[4px]"
            :text="stats.collectedCount.toString()"
          />
          <Label
            preset="h6"
            class="text-medium-gray"
            :text="$t('nft_portfolio_page_label_collected')"
            valign="middle"
          >
            <template #prepend>
              <IconMint />
            </template>
          </Label>
        </div>
        <div class="flex flex-col items-center justify-center">
          <div class="flex items-end">
            <Label
              preset="h3"
              class="text-like-green mb-[4px]"
              :text="`${Math.ceil(stats.collectedAmount).toLocaleString(
                'en-US')}`"
            />&nbsp;<span class="text-like-green mb-[4px]">{{ $t('header_menu_LIKE') }}</span>
          </div>
          <Label
            preset="h6"
            class="text-medium-gray"
            :text="$t('nft_portfolio_page_state_value')"
            valign="middle"
          >
            <template #prepend>
              <IconPriceMini />
            </template>
          </Label>
        </div>
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
        <div class="flex flex-col items-center justify-center">
          <Label
            preset="h3"
            class="text-like-green mb-[4px]"
            :text="isLoading ? '-' : stats.createdCount.toString()"
          />
          <Label
            preset="h6"
            class="text-medium-gray"
            :text="$t('nft_portfolio_page_label_created')"
            valign="middle"
          >
            <template #prepend>
              <IconFlare />
            </template>
          </Label>
        </div>
        <div class="flex flex-col items-center justify-center">
          <Label
            preset="h3"
            class="text-like-green mb-[4px]"
            :text="isLoading ? '-' : stats.createdCollectorCount.toString()"
          />
          <Label
            preset="h6"
            class="text-medium-gray"
            :text="$t('nft_portfolio_page_state_collectors')"
            valign="middle"
          >
            <template #prepend>
              <IconPersonMini />
            </template>
          </Label>
        </div>
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
