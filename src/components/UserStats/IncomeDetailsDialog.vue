<template>
  <Dialog
    :open="isOpenDialog"
    panel-container-class="min-w-[300px] max-w-[90vw] laptop: max-w-[720px]"
    panel-component="CardV2"
    panel-class="overflow-y-scroll shadow-lg"
    @close="$emit('close')"
  >
    <div v-if="isLoading" class="flex justify-center my-[48px]">
      <ProgressIndicator v-if="isLoading" />
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
  COMMISSION: 'commission',
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
    totalSales: {
      type: [Number, String],
      default: undefined,
    },
    totalCommission: {
      type: [Number, String],
      default: undefined,
    },
    salesDetails: {
      type: Array,
      default: () => [],
    },
    commissionDetails: {
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
          amount: Math.floor(this.totalSales * nanolike),
        },
        {
          text: this.$t('dashboard_button_type_commissions'),
          value: DETAILS_TYPE.COMMISSION,
          amount: Math.floor(this.totalCommission * nanolike),
        },
      ];

      return items.map(item => ({
        ...item,
        isSelected: item.value === this.currentTargetType,
      }));
    },
    populatedCommissionDetails() {
      return this.populateDetails(this.commissionDetails);
    },
    populatedSalesList() {
      return this.populateDetails(this.salesDetails);
    },
    currentList() {
      switch (this.currentTargetType) {
        case DETAILS_TYPE.SALES:
          return this.populatedSalesList;

        case DETAILS_TYPE.COMMISSION:
        default:
          return this.populatedCommissionDetails;
      }
    },
    salesButtonPreset() {
      switch (this.currentTargetType) {
        case DETAILS_TYPE.SALES:
          return 'primary';

        case DETAILS_TYPE.COMMISSION:
        default:
          return 'plain';
      }
    },
    IncomeButtonPreset() {
      switch (this.currentTargetType) {
        case DETAILS_TYPE.SALES:
          return 'plain';

        case DETAILS_TYPE.COMMISSION:
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
    populateDetails(list) {
      return list.map(item => {
        const itemSales = Math.floor(item.sales * nanolike);
        const salesEarnings = Math.floor(item.total_amount * nanolike);

        return {
          classId: item.class_id,
          nftName: this.getNFTClassMetadataById(item.class_id)?.name,
          itemSales,
          salesEarnings,
          commissionPercentage: Math.floor((salesEarnings / itemSales) * 100),
          ...item,
        };
      });
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

        case DETAILS_TYPE.COMMISSION:
        default:
          logTrackerEvent(
            this,
            'MyDashboard',
            'MyDashboard_commission_click',
            `${this.address}`,
            1
          );
          break;
      }
    },
  },
};
</script>
