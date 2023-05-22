<template>
  <Dialog
    :open="isOpenDialog"
    panel-container-class="min-w-[300px] max-w-[90vw] laptop: max-w-[720px]"
    panel-component="CardV2"
    panel-class="overflow-y-scroll shadow-lg"
    @close="$emit('close')"
  >
    <div v-if="!currentList.length" class="flex justify-center my-[48px]">
      <ProgressIndicator v-if="isLoading" />
      <Label
        v-else
        align="center"
        class="text-medium-gray"
        :text="$t('portfolio_follower_no_follower')"
      />
    </div>
    <div v-else class="flex flex-col gap-[16px]">
      <UserStatsIncomeMenuItem
        :current-target-type="currentTargetType"
        :type-menu-item-list="typeMenuItemList"
        @on-type-click="handleTypeClick"
      />
      <UserStatsIncomeTable
        :current-target-type="currentTargetType"
        :current-list="currentList"
      />
    </div>
  </Dialog>
</template>

<script>
import { ellipsis } from '~/util/ui';
import nftMixin from '~/mixins/nft';
import { logTrackerEvent } from '~/util/EventLogger';

const DETAILS_TYPE = {
  STAKEHOLDER_INCOME: 'income',
  SALES: 'sales',
};

const nanolike = 0.000000001;

export default {
  filters: {
    ellipsis,
  },
  mixins: [nftMixin],
  props: {
    targetType: {
      type: String,
      default: DETAILS_TYPE.SALES,
    },
    address: {
      type: String,
      default: undefined,
    },
    isOpenDialog: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    stakeholderIncomeDetails: {
      type: Array,
      default: () => [],
    },
    salesDetails: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return { currentTargetType: DETAILS_TYPE.SALES };
  },
  computed: {
    typeMenuItemList() {
      const items = [
        {
          text: this.$t('dashboard_button_type_sales'),
          value: DETAILS_TYPE.SALES,
        },
        {
          text: this.$t('dashboard_button_type_stakeholder_income'),
          value: DETAILS_TYPE.STAKEHOLDER_INCOME,
        },
      ];

      return items.map(item => ({
        ...item,
        isSelected: item.value === this.currentTargetType,
      }));
    },
    populatedIncomeList() {
      return this.populateDetails(this.stakeholderIncomeDetails);
    },
    populatedSalesList() {
      return this.populateDetails(this.salesDetails);
    },
    currentList() {
      switch (this.currentTargetType) {
        case DETAILS_TYPE.SALES:
          return this.populatedSalesList;

        case DETAILS_TYPE.STAKEHOLDER_INCOME:
        default:
          return this.populatedIncomeList;
      }
    },
    salesButtonPreset() {
      switch (this.currentTargetType) {
        case DETAILS_TYPE.SALES:
          return 'primary';

        case DETAILS_TYPE.STAKEHOLDER_INCOME:
        default:
          return 'plain';
      }
    },
    IncomeButtonPreset() {
      switch (this.currentTargetType) {
        case DETAILS_TYPE.SALES:
          return 'plain';

        case DETAILS_TYPE.STAKEHOLDER_INCOME:
        default:
          return 'primary';
      }
    },
  },
  watch: {
    targetType(type) {
      if (type) {
        this.currentTargetType = type;
      }
    },
  },
  methods: {
    populateDetails(details) {
      return details.reduce((result, item) => {
        const existingItem = result.find(i => i.classId === item.class_id);
        if (existingItem) {
          existingItem.amount += item.amount;
          existingItem.price += item.price;
        } else {
          result.push({
            classId: item.class_id,
            nftName: this.getNFTClassMetadataById(item.class_id)?.name,
            itemSales: Math.floor(item.price * nanolike),
            commissionIncome: Math.floor(item.amount * nanolike),
            commissionPercentage: Math.floor((item.amount / item.price) * 100),
            ...item,
          });
        }
        return result;
      }, []);
    },
    handleTypeClick(type) {
      this.currentTargetType = type;
      switch (type) {
        case DETAILS_TYPE.SALES:
          logTrackerEvent(
            this,
            'MyDashboard',
            'MyDashboard_sales_click',
            `${this.address}`,
            1
          );
          break;

        case DETAILS_TYPE.STAKEHOLDER_INCOME:
        default:
          logTrackerEvent(
            this,
            'MyDashboard',
            'MyDashboard_stakeholder_income_click',
            `${this.address}`,
            1
          );
          break;
      }
    },
  },
};
</script>
