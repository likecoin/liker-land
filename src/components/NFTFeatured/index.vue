<template>
  <div
    v-if="!readOnly || displayState === 'featured'"
    :class="[
      'absolute',
      'group',
      'top-[12px]',
      'right-[12px]',
      'transition',
      'ease-in',
      'duration-200',
      { 'cursor-pointer': readOnly },
      { 'cursor-default': !readOnly }]"
    @click="(e) => handleClick(e)"
  >
    <div class="flex gap-[8px] items-center">
      <div
        v-if="!readOnly && formatdisplayState"
        :class="[
          'px-[20px]',
          'py-[4px]',
          'rounded-[16px]',
          'opacity-75',
          'group-hover:opacity-100',
          'transition',
          'ease-in',
          'duration-200',
          bgColorClasses,
        ]"
      >
        {{ formatdisplayState }}
      </div>
      <div class="w-[40px] h-[40px] relative">
        <div
          :class="[
            'w-[40px]',
            'h-[40px]',
            'rounded-[50%]',
            'opacity-75',
            { 'group-hover:opacity-100': !readOnly },
            'transition',
            'ease-in',
            'duration-200',
            bgColorClasses,
          ]"
        />
        <IconStartFilled
          v-if="displayState === 'featured'"
          :class="iconClasses"
        />
        <IconStartOutlined
          v-if="displayState === 'default'"
          :class="[iconClasses, 'opacity-75']"
        />
        <IconHide v-if="displayState === 'hidden'" :class="iconClasses" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { NFT_DISPLAY_STATE } from '~/constant';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
  props: {
    displayState: {
      type: String,
      default: NFT_DISPLAY_STATE.DEFAULT,
    },
    classId: {
      type: String,
      default: undefined,
    },
    readOnly: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    ...mapGetters(['getAddress', 'walletHasLoggedIn']),
    formatdisplayState() {
      switch (this.displayState) {
        case NFT_DISPLAY_STATE.FEATURED:
          return this.$t('nft_portfolio_page_label_featured');

        case NFT_DISPLAY_STATE.HIDDEN:
          return this.$t('nft_portfolio_page_label_hidden');

        case NFT_DISPLAY_STATE.DEFAULT:
        default:
          return '';
      }
    },
    bgColorClasses() {
      switch (this.displayState) {
        case NFT_DISPLAY_STATE.FEATURED:
          return ['bg-white'];
        case NFT_DISPLAY_STATE.HIDDEN:
          return ['bg-[#9B9B9B]'];
        case NFT_DISPLAY_STATE.DEFAULT:
        default:
          return ['bg-medium-gray'];
      }
    },
    iconClasses() {
      return [
        'w-[20px]',
        'absolute',
        'top-[50%]',
        'left-[50%]',
        'translate-x-[-50%]',
        'translate-y-[-50%]',
      ];
    },
  },

  methods: {
    ...mapActions(['signLogin', 'setNFTDisplayState']),
    async handleClick(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.readOnly) return;

      if (!this.walletHasLoggedIn) {
        await this.signLogin();
      }

      switch (this.displayState) {
        case NFT_DISPLAY_STATE.FEATURED:
          logTrackerEvent(
            this,
            'NFT',
            'dashboard_nft_display_state_hide',
            this.classId,
            1
          );
          await this.setNFTDisplayState({
            address: this.getAddress,
            classId: this.classId,
            displayState: NFT_DISPLAY_STATE.HIDDEN,
          });
          break;
        case NFT_DISPLAY_STATE.HIDDEN:
          logTrackerEvent(
            this,
            'NFT',
            'dashboard_nft_display_state_reset',
            this.classId,
            1
          );
          await this.setNFTDisplayState({
            address: this.getAddress,
            classId: this.classId,
            displayState: NFT_DISPLAY_STATE.DEFAULT,
          });
          break;
        case NFT_DISPLAY_STATE.DEFAULT:
          logTrackerEvent(
            this,
            'NFT',
            'dashboard_nft_display_state_feature',
            this.classId,
            1
          );
          await this.setNFTDisplayState({
            address: this.getAddress,
            classId: this.classId,
            displayState: NFT_DISPLAY_STATE.FEATURED,
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>
