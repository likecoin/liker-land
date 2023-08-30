<template>
  <div class="flex flex-col gap-[8px] justify-center items-center">
    <ButtonV2
      preset="secondary"
      :is-disabled="!isCollectable"
      @click="handleClickCollectButton"
    >
      <template v-if="isCollectable" #prepend>
        <IconPrice />
      </template>
      {{ buttonText }}
    </ButtonV2>
    <div 
      v-if="shouldShowExpiryTime" 
      class="flex gap-[4px] justify-center items-center" 
      :class="expiryTimeClass"
    >
      <IconClock />
      <div>{{ collectExpiryTimeForDisplay }}</div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { normalizeLocaleForDayjs } from '~/locales';

export default {
  props: {
    buttonText: {
      type: String,
      default: '',
    },
    isCollectable: {
      type: Boolean,
      default: false,
    },
    collectExpiryTime: {
      type: Number,
      default: 0,
    },
    shouldShowExpiryTimeBeforeExpired: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isCollectExpiryTimeNear() {
      if (!this.collectExpiryTime) return false;

      const timeLeft = this.collectExpiryTime - Date.now();
      const threshold = 4 * 7 * 24 * 60 * 60 * 1000; // 4 weeks
      return timeLeft > 0 && timeLeft <= threshold;
    },
    collectExpiryTimeForDisplay() {
      if (!this.collectExpiryTime) return '';

      const timeLeft = this.collectExpiryTime - Date.now();
      if (timeLeft <= 0) return '';

      const dateTime = dayjs(this.collectExpiryTime);
      if (this.isCollectExpiryTimeNear) {
        const duration = dateTime
          .locale(normalizeLocaleForDayjs(this.$i18n.locale))
          .fromNow(true);
        return this.$t('nft_collect_expiry_time_near', { duration });
      }
      const date = dateTime.format('YYYY-MM-DD');
      return this.$t('nft_collect_expiry_time_far', { date });
    },
    expiryTimeClass() {
      return this.isCollectExpiryTimeNear
        ? 'text-pending-orange'
        : 'text-white';
    },
    shouldShowExpiryTime() {
      return (
        this.collectExpiryTimeForDisplay &&
        (this.isCollectExpiryTimeNear || this.shouldShowExpiryTimeBeforeExpired)
      );
    },
  },
  methods: {
    handleClickCollectButton() {
      this.$emit('click-collect-button');
    },
  },
};
</script>
