<template>
  <div class="flex gap-[8px] items-center">
    <div :class="['font-[600]', textStyle]" v-text="text" />
    <div
      v-if="tooltipText"
      class="relative hidden group laptop:block"
      @mouseenter="hoverTooltips"
    >
      <IconInfo />
      <NFTBookTooltips
        class="hidden group-hover:block"
        :tooltip-text="tooltipText"
        :tooltip-title="tooltipTitle"
      />
    </div>

    <div
      v-if="tooltipText"
      class="cursor-pointer laptop:hidden"
      @click="onclickShowTooltips"
    >
      <IconInfo />
    </div>
    <BottomDialog
      v-if="showTooltips"
      :title="tooltipTitle"
      @close="closeTooltips"
    >
      <template #content>
        {{ tooltipText }}
      </template>
    </BottomDialog>
  </div>
</template>

<script>
import { PRESET_TYPE } from '~/components/NFTBook/ItemCard';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  props: {
    text: {
      type: String,
      default: '',
    },
    preset: {
      type: String,
      default: PRESET_TYPE.DEFAULT,
    },
    tooltipText: {
      type: String,
      default: undefined,
    },
    tooltipTitle: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      showTooltips: false,
    };
  },
  computed: {
    textStyle() {
      if (this.preset === PRESET_TYPE.CAMPAIGN) return 'text-white';
      return 'text-dark-gray';
    },
  },
  methods: {
    hoverTooltips() {
      logTrackerEvent(this, 'NFTBook', 'TooltipsHover', '', 1);
    },
    onclickShowTooltips() {
      this.showTooltips = true;
      logTrackerEvent(this, 'NFTBook', 'TooltipsClicked', '', 1);
    },
    closeTooltips() {
      this.showTooltips = false;
    },
  },
};
</script>
