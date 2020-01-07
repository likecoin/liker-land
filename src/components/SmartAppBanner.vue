<template lang="pug">
  .smart-app-banner(v-if="isOpen")
    .smart-app-banner__content-container
      .smart-app-banner__header
        | {{ $t('SmartAppBanner.headerTitle') }}
      .smart-app-banner__body
        .smart-app-banner__body-row
          .smart-app-banner__body-row-left
            AppIcon.smart-app-banner__app-icon
            span {{ $t('SmartAppBanner.appLabel') }}
          .smart-app-banner__body-row-right
            a.btn.btn--dark.btn--block.w-full(
              :href="getAppURL"
              @click="dismiss"
            )
              | {{ $t('SmartAppBanner.appButtonText') }}
        .smart-app-banner__body-row
            button.btn.btn--outlined.m-0(
              @click="dismiss"
            )
              | {{ $t('SmartAppBanner.dismissButtonText') }}
</template>

<script>
import AppIcon from '~/assets/images/app-icon.svg';
import { getAppURL } from '~/util/api';
import { checkIsMobileClient } from '~/util/client';

const WHITELISTED_ROUTE_REGEX = /^(oauth-redirect|civic.*)$/;

let hasOpened = false;

export default {
  name: 'SmartAppBanner',
  components: {
    AppIcon,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    getAppURL,
  },
  mounted() {
    if (
      !hasOpened &&
      checkIsMobileClient() &&
      !WHITELISTED_ROUTE_REGEX.test(this.$route.name)
    ) {
      this.isOpen = true;
    }
  },
  methods: {
    dismiss() {
      hasOpened = true;
      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss">
.smart-app-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  color: config('colors.gray-4a');
  background-color: rgba(#4a4a4a, 0.5);

  &__content-container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: white;

    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }

  &__header {
    padding: 10px;
    border-bottom: #d8d8d8 solid 1px;

    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    text-align: center;
  }

  &__body {
    padding: 10px 12px;

    &-row {
      display: flex;
      justify-content: center;

      padding: 10px 12px;

      &-left,
      &-right {
        display: inherit;
        align-items: center;
      }

      &-left {
        flex-grow: 1;
      }

      &-right {
        min-width: 104px;
      }
    }
  }

  &__app-icon {
    width: 48px;
    margin-right: 12px;

    border-radius: 8px;
  }
}
</style>
