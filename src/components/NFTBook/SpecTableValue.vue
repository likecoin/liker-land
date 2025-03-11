<template>
  <div class="flex gap-[8px] items-center">
    <div :class="['font-[600]', textStyle]" v-text="text" />
    <div
      v-if="tooltipText"
      class="relative hidden group laptop:block"
      @mouseenter="hoverTooltip"
    >
      <IconInfo class="w-[16px] h-[16px]" />
      <NFTBookTooltip
        class="hidden group-hover:block"
        :tooltip-text="tooltipText"
        :tooltip-title="tooltipTitle"
      />
    </div>

    <div
      v-if="tooltipText"
      class="cursor-pointer laptop:hidden"
      @click="onclickShowTooltip"
    >
      <IconInfo class="w-[16px] h-[16px]" />
    </div>
    <BottomDialog
      v-if="showTooltip"
      :title="tooltipTitle"
      @close="closeTooltip"
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
      showTooltip: false,
    };
  },
  computed: {
    textStyle() {
      if (this.preset === PRESET_TYPE.CAMPAIGN) return 'text-white';
      return 'text-dark-gray';
    },
  },
  methods: {
    hoverTooltip() {
      logTrackerEvent(this, 'NFTBook', 'TooltipHover', '', 1);
    },
    onclickShowTooltip() {
      this.showTooltip = true;
      logTrackerEvent(this, 'NFTBook', 'TooltipClicked', '', 1);
      this.$emit('clickTooltip');
    },
    closeTooltip() {
      this.showTooltip = false;
    },
  },
};
</script>
