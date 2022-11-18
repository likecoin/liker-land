<template>
  <div
    v-if="preset === 'edit' || (preset === 'viewOnly' && currentState === 'featured')"
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
        v-if="preset === 'edit' && formatCurrentState"
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
        {{ formatCurrentState }}
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
          v-if="currentState === 'featured'"
          :class="iconClasses"
        />
        <IconStartOutlined
          v-if="currentState === 'default'"
          :class="[iconClasses, 'opacity-75']"
        />
        <IconHide v-if="currentState === 'hidden'" :class="iconClasses" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { formatFeaturedNFTUrl, formatHiddenNFTUrl } from '~/util/api';
import { AUTH_COOKIE_NAME } from '~/constant';

const Preset = {
  EDIT: 'edit',
  VIEW_ONLY: 'viewOnly',
  INVISIBLE: 'invisible',
};

const CurrentState = {
  FEATURED: 'featured',
  DEFAULT: 'default',
  HIDDEN: 'hidden',
};

export default {
  props: {
    currentState: {
      type: String,
      default: CurrentState.DEFAULT,
    },
    classId: {
      type: String,
      default: undefined,
    },
    preset: {
      type: String,
      default: Preset.VIEW_ONLY,
    },
  },

  computed: {
    ...mapGetters(['getAddress', 'hasLoggedIn']),
    formatCurrentState() {
      switch (this.currentState) {
        case CurrentState.FEATURED:
          return this.$t('nft_portfolio_page_label_featured');

        case CurrentState.DEFAULT:
          return undefined;

        case CurrentState.HIDDEN:
          return this.$t('nft_portfolio_page_label_hidden');

        default:
          return undefined;
      }
    },
    bgColorClasses() {
      switch (this.currentState) {
        case CurrentState.FEATURED:
          return ['bg-white'];

        case CurrentState.DEFAULT:
          return ['bg-medium-gray'];

        case CurrentState.HIDDEN:
          return ['bg-[#9B9B9B]'];

        default:
          return [];
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
    ...mapActions(['signLogin']),
    async handleClick(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.preset !== Preset.EDIT) return;

      if (!this.hasLoggedIn) {
        await this.signLogin();
      }

      let newState = '';
      switch (this.currentState) {
        case CurrentState.FEATURED:
          newState = CurrentState.HIDDEN;
          await Promise.all([
            this.$api.delete(`${this.featuredNFTUrl}/${this.classId}`),
            this.$api.post(this.hiddenNFTUrl, {
              classId: this.classId,
            }),
          ]);
          break;
        case CurrentState.HIDDEN:
          newState = CurrentState.DEFAULT;
          await this.$api.delete(`${this.hiddenNFTUrl}/${this.classId}`);
          break;
        case CurrentState.DEFAULT:
          newState = CurrentState.FEATURED;
          await this.$api.post(this.featuredNFTUrl, {
            classId: this.classId,
          });
          break;
        default:
          break;
      }

      this.$emit('state-change', newState);
    },
  },
};
</script>
