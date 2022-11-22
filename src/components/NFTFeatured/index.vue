<template>
  <div
    v-if="preset === 'edit' || (preset === 'read-only' && displayState === 'featured')"
    :class="[
      'absolute',
      'group',
      'top-[12px]',
      'right-[12px]',
      'transition',
      'ease-in',
      'duration-200',
      { 'cursor-pointer': preset === 'edit' },
      { 'cursor-default': preset !== 'edit' }]"
    @click="(e) => handleClick(e)"
  >
    <div class="flex gap-[8px] items-center">
      <div
        v-if="preset === 'edit' && formatdisplayState"
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
            { 'group-hover:opacity-100': preset === 'edit' },
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
import { formatFeaturedNFTUrl, formatHiddenNFTUrl } from '~/util/api';
import { AUTH_COOKIE_NAME, NFT_DISPLAY_STATE } from '~/constant';

const Preset = {
  EDIT: 'edit',
  READ_ONLY: 'read-only',
  HIDDEN: 'hidden',
};

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
    preset: {
      type: String,
      default: Preset.READ_ONLY,
    },
  },

  computed: {
    ...mapGetters(['getAddress', 'hasLoggedIn']),
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
    hasLogin() {
      return !!this.$cookie.get(AUTH_COOKIE_NAME);
    },
    featuredNFTUrl() {
      return formatFeaturedNFTUrl(this.getAddress);
    },
    hiddenNFTUrl() {
      return formatHiddenNFTUrl(this.getAddress);
    },
  },

  methods: {
    ...mapActions([
      'signLogin',
      'addNFTFeatured',
      'addNFTHidden',
      'removeNFTFeatured',
      'removeNFTHidden',
    ]),
    async handleClick(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.preset !== Preset.EDIT) return;

      if (!this.hasLoggedIn) {
        await this.signLogin();
      }

      switch (this.displayState) {
        case NFT_DISPLAY_STATE.FEATURED:
          this.removeNFTFeatured({
            address: this.getAddress,
            classId: this.classId,
          });
          this.addNFTHidden({
            address: this.getAddress,
            classId: this.classId,
          });
          await Promise.all([
            this.$api.delete(`${this.featuredNFTUrl}/${this.classId}`),
            this.$api.post(this.hiddenNFTUrl, {
              classId: this.classId,
            }),
          ]);
          break;
        case NFT_DISPLAY_STATE.HIDDEN:
          this.removeNFTHidden({
            address: this.getAddress,
            classId: this.classId,
          });
          await this.$api.delete(`${this.hiddenNFTUrl}/${this.classId}`);
          break;
        case NFT_DISPLAY_STATE.DEFAULT:
          this.addNFTFeatured({
            address: this.getAddress,
            classId: this.classId,
          });
          await this.$api.post(this.featuredNFTUrl, {
            classId: this.classId,
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>
