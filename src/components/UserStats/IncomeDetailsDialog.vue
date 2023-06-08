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
        @type-click="handleTypeClick"
      />
      <UserStatsIncomeTable
        :current-target-type="currentTargetType"
        :current-list="currentList"
      />
    </div>
  </Dialog>
</template>

<script>
import nftMixin from '~/mixins/nft';

import { ellipsis } from '~/util/ui';
import { convertToLIKEPrice } from '~/util/nft';
import { logTrackerEvent } from '~/util/EventLogger';

const DETAILS_TYPE = {
  ROYALTY: 'royalty',
  SALES: 'sales',
};

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
    totalRoyalty: {
      type: [Number, String],
      default: undefined,
    },
    salesDetails: {
      type: Array,
      default: () => [],
    },
    royaltyDetails: {
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
          amount: convertToLIKEPrice(this.totalSales),
        },
        {
          text: this.$t('dashboard_button_type_royalties'),
          value: DETAILS_TYPE.ROYALTY,
          amount: convertToLIKEPrice(this.totalRoyalty),
        },
      ];

      return items.map(item => ({
        ...item,
        isSelected: item.value === this.currentTargetType,
      }));
    },
    populatedRoyaltyDetails() {
      return this.populateDetails(this.royaltyDetails);
    },
    populatedSalesList() {
      return this.populateDetails(this.salesDetails);
    },
    currentList() {
      switch (this.currentTargetType) {
        case DETAILS_TYPE.SALES:
          return this.populatedSalesList;

        case DETAILS_TYPE.ROYALTY:
        default:
          return this.populatedRoyaltyDetails;
      }
    },
    salesButtonPreset() {
      switch (this.currentTargetType) {
        case DETAILS_TYPE.SALES:
          return 'primary';

        case DETAILS_TYPE.ROYALTY:
        default:
          return 'plain';
      }
    },
    IncomeButtonPreset() {
      switch (this.currentTargetType) {
        case DETAILS_TYPE.SALES:
          return 'plain';

        case DETAILS_TYPE.ROYALTY:
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
        const itemSales = convertToLIKEPrice(item.sales);
        const salesEarnings = convertToLIKEPrice(item.total_amount);

        return {
          classId: item.class_id,
          nftName:
            this.getNFTClassMetadataById(item.class_id)?.name ||
            this.$t('dashboard_table_untitled'),
          itemSales,
          salesEarnings,
          royaltyPercentage: Math.floor((salesEarnings / itemSales) * 100),
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

        case DETAILS_TYPE.ROYALTY:
        default:
          logTrackerEvent(
            this,
            'MyDashboard',
            'MyDashboard_royalty_click',
            `${this.address}`,
            1
          );
          break;
      }
    },
  },
};
</script>
