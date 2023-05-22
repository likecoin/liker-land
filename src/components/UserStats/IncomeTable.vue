<template>
  <ul class="flex flex-col px-[6px] laptop:px-[12px]">
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
        <Label>{{ item.nftName }}</Label>

        <div v-if="isTypeTotalSales" class="flex justify-start gap-[6px]" />
        <div v-else class="flex justify-start gap-[6px] mt-[6px]">
          <ToolTips :tool-tip-text="$t('dashboard_table_class_price')">
            <div class="py-[4px] px-[8px] rounded-[6px] bg-shade-gray text-10">{{ item.itemSales | formatNumberWithLIKE }}</div>
          </ToolTips>
          <ToolTips :tool-tip-text="$t('dashboard_table_class_stake_percentage')">
            <div class="py-[4px] px-[8px] rounded-[6px] bg-like-cyan-pale text-10">{{ item.commissionPercentage }}%</div>
          </ToolTips>
        </div>
      </div>

      <div v-if="isTypeTotalSales" class="flex-shrink-0 text-like-green">
        {{ item.itemSales | formatNumberWithLIKE }}
      </div>
      <ToolTips v-else :tool-tip-text="$t('dashboard_table_class_stake_income')">
        <div class="flex-shrink-0 text-like-cyan-dark whitespace-nowrap">
          {{ item.commissionIncome | formatNumberWithLIKE }}
        </div>
      </ToolTips>
    </li>
  </ul>
</template>
<script>
import { formatNumberWithLIKE } from '~/util/ui';

const DETAILS_TYPE = {
  STAKEHOLDER_INCOME: 'income',
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
