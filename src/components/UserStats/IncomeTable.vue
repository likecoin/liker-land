<template>
  <div>
    <ul v-if="currentList.length" class="flex flex-col px-[6px] laptop:px-[12px]">
      <li
        v-for="item in currentList"
        :key="item.classId"
        :class="[
          'flex',
          'flex-col',
          'gap-[12px]',
          'laptop:flex-row',
          'laptop:gap-0',

          'justify-start',
          'items-start',
          'laptop:justify-between',
          'laptop:items-center',

          'px-[12px]',
          'py-[18px]',
          'border-b-2',
          'border-shade-gray',

          'transition-all',
          'duration-150',
          'hover:bg-light-gray',
        ]"
      >
        <div class="flex flex-col justify-start mr-[12px] text-dark-gray">
          <NuxtLink
            :to="localeLocation(
              { name: 'nft-class-classId',
                params: { classId: item.classId } })"
            target="_blank"
          >
            <Label preset="h5" class="text-like-green">{{ item.nftName }}</Label>
          </NuxtLink>

          <div class="flex justify-start gap-[6px] mt-[6px]">
            <ToolTips v-if="isTypeTotalSales" :tool-tip-text="$t('dashboard_table_class_price')">
              <div class="py-[4px] px-[8px] rounded-[6px] bg-shade-gray text-10 cursor-default">{{ item.itemSales | formatNumberWithLIKE }}</div>
            </ToolTips>
            <ToolTips :tool-tip-text="$t('dashboard_table_class_stake_percentage')">
              <div class="py-[4px] px-[8px] rounded-[6px] bg-like-cyan-pale text-10 cursor-default">{{ item.commissionPercentage }}%</div>
            </ToolTips>
          </div>
        </div>

        <ToolTips :tool-tip-text="$t('dashboard_table_class_net_earning')">
          <div class="flex-shrink-0 cursor-default text-like-cyan-dark whitespace-nowrap">
            {{ item.salesEarnings | formatNumberWithLIKE }}
          </div>
        </ToolTips>
      </li>
    </ul>
    <div v-else class=" w-full my-[62px]">
      <Label class="text-medium-gray" :text="$t('dashboard_table_no_data')" align="center" />
    </div>
  </div>
</template>
<script>
import { formatNumberWithLIKE } from '~/util/ui';

const DETAILS_TYPE = {
  COMMISSION: 'commission',
  SALES: 'sales',
};

export default {
  filters: {
    formatNumberWithLIKE,
  },
  props: {
    currentTargetType: {
      type: String,
      default: DETAILS_TYPE.SALES,
    },
    currentList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    isTypeTotalSales() {
      return this.currentTargetType === DETAILS_TYPE.SALES;
    },
  },
};
</script>
